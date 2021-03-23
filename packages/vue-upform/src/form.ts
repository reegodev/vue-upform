import {
  Component,
  AsyncComponentLoader,
  h,
  VNode,
  SetupContext,
  unref,
} from 'vue'
import { getFormRenderer } from './renderer'
import { getNestedObject } from './utils'

export interface FormControl {
  name: string
  as: string | Component | AsyncComponentLoader
  initialValue?: any
  props?: Record<string, any>
  rules?: string
  children?: FormControl[]
  static?: boolean
}

export interface FormModelConfig {
  renderer?: string
  extends?: string
  fields: FormControl[]
}

export interface UpformContext {
  submit: () => void
  reset: () => void
  value: Record<string, any>
  emit: (event: string, ...args: any[]) => void
  status: Record<string, any>
}

export type FormModel = FormControl[] | FormModelConfig

export const models: Map<string, FormModelConfig> = new Map()

export const createForm = (name: string, mod: FormModel): void => {
  if (models.has(name)) {
    throw new Error(`A form named "${name}" is already present.`)
  }

  let model = { renderer: 'default', extends: '', fields: [] }
  if (Array.isArray(mod)) {
    model.fields = mod
  } else {
    model = Object.assign(model, mod)
  }

  models.set(name, model)
}

export const createFormContext = (
  initialValue: Record<string, any>,
  ctx: SetupContext<any>,
): UpformContext => {
  const formContext = {
    submit: () => {
      ctx.emit('submit', {
        payload: formContext.value,
        status: formContext.status,
      })
    },
    reset: () => {
      ctx.emit('reset')
    },
    value: unref(initialValue),
    status: {
      pristine: true,
      touched: false,
      valid: true,
      invalid: false,
      loading: false,
    },
    emit: ctx.emit,
  }
  return formContext
}

export const renderForm = (
  name: string,
  context: UpformContext,
  formRenderer: string = null,
): VNode => {
  if (!models.has(name)) {
    throw new Error(`Form "${name}" does not exist.`)
  }

  const model = models.get(name)
  const rendererName = formRenderer || model.renderer || 'default'

  const form = h(
    'form',
    {
      class: 'upform-form',
      onSubmit(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        context.submit()
      },
      onReset(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        context.reset()
      },
    },
    {
      default() {
        return model.fields.map((field) => {
          return renderControl(field, context, rendererName)
        })
      },
    },
  )

  return h(
    'div',
    {
      class: 'upform-wrapper',
    },
    form,
  )
}

export const renderControl = (
  control: FormControl,
  context: UpformContext,
  rendererName: string = null,
  path: string = null,
): VNode => {
  let component = null
  if (typeof control.as === 'string') {
    // Lazy evaluate renderer existence,
    // so that models that only use raw components can work
    const renderer = getFormRenderer(rendererName)
    component = renderer[control.as]
  } else {
    component = control.as
  }

  if (!component) {
    throw new Error(`Missing render component for field "${control.name}".`)
  }

  const attributes = Object.assign({}, control.props || {})
  const currentModelValue = getNestedObject(context.value, path)

  // Set the initial value on the model if its missing
  if (
    typeof currentModelValue[control.name] === 'undefined' &&
    !control.static
  ) {
    if (control.children) {
      currentModelValue[control.name] = {}
    } else {
      currentModelValue[control.name] =
        typeof control.initialValue !== 'undefined' ? control.initialValue : ''
    }

    context.emit('update:modelValue', context.value)
  }

  // Add v-model support to leaf components
  if (!control.children) {
    attributes.modelValue = currentModelValue[control.name]
    attributes['onUpdate:modelValue'] = (value) => {
      currentModelValue[control.name] = value
      context.emit('update:modelValue', context.value)
    }
  }

  return h(component, attributes, {
    default() {
      return (control.children || []).map((child) => {
        return renderControl(
          child,
          context,
          rendererName,
          [path, control.name].filter(Boolean).join('.'),
        )
      })
    },
  })
}
