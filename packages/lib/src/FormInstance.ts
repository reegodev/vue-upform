import {
  reactive,
  getCurrentInstance,
  ComponentInternalInstance,
  VNode,
  h,
  SetupContext,
  EmitsOptions,
} from 'vue'
import { configs, FormConfig, FormControl } from './config'
import { getFormRenderer } from './renderer'
import { getNestedObject } from './utils'

export type FormModelValue = Record<string, unknown>

export interface FormOptions {
  name: string
  renderer?: string
  initialValue?: FormModelValue
}

export class Form {
  /**
   * Name of the form to render
   */
  protected name: string

  /**
   * Configuration of the form to render
   */
  protected config: FormConfig

  /**
   * Name of the renderer used
   */
  protected rendererName: string

  /**
   * Inital value of the form
   */
  protected initialValue: FormModelValue

  /**
   * Current value of the form, provided through v-models in child components 
   */
   protected currentValue: FormModelValue
  
  /**
   * Current Upform component instance
   */
  protected component: ComponentInternalInstance

  /**
   * The component SetupContext 
   */
  protected context: SetupContext<EmitsOptions>

  /**
   * Create a new Form instance
   * 
   * @param name - The name of the form
   * @param rendererName - The name of the renderer
   * @param initialValue - The initial value of the form
   */
  constructor(options: FormOptions, context: SetupContext<EmitsOptions>) {
    this.name = options.name
    
    if (!configs.has(this.name)) {
      throw new Error(`Form "${this.name}" does not exist.`)
    }

    this.config = configs.get(this.name)
    this.context = context
    this.rendererName = options.renderer || this.config.renderer || 'default'
    this.component = getCurrentInstance()
    if (!this.component) {
      throw new Error(`Component instance not found for form "${this.name}".`)
    }

    this.createInitialValue(options.initialValue || {})
  }

  /**
   * Getter that retuns the current value of the form
   * 
   * @returns The current value of the form
   */
  get value(): FormModelValue {
    return this.currentValue
  }

  /**
   * Getter that retuns the resolved renderer name
   * 
   * @returns The renderer name
   */
   get renderer(): string {
    return this.rendererName
  }

  /**
   * Parse the form config and create the initial value
   *
   * @param initialValue - The initial value of the form
   */
  createInitialValue(initialValue: FormModelValue = {}) {
    // Use a deep copy of the initial value, as we are going to modify it
    const modelValue = JSON.parse(JSON.stringify(initialValue))

    const createNestedValue = (control: FormControl, parentValue: FormModelValue) => {
      if (control.children && control.children.length) {
        if (control.name && !parentValue[control.name]) {
          parentValue[control.name] = {}
        }

        control.children.forEach(child => {
          createNestedValue(child, (control.name ? parentValue[control.name] : parentValue) as FormModelValue)
        })
      } else if (control.name && typeof parentValue[control.name] === 'undefined') {
        parentValue[control.name] = control.initialValue ?? null
      }
    }

    this.config.fields.forEach(field => {
      createNestedValue(field, modelValue)
    })

    this.initialValue = modelValue
    this.reset()
  }

  /**
   * Reset the form value to the initial value
   */
  reset() {
    this.currentValue = reactive(JSON.parse(JSON.stringify(this.initialValue)))
  }

  /**
   * Render a form control into a VNode
   * 
   * @param control - The form control to render
   * @param path - The path of the value as string, ie: 'a.b.c',
   * @returns 
   */
  renderControl(control: FormControl, path: string = null): VNode {
    let component = null
    if (typeof control.as === 'string') {
      // Lazy evaluate renderer existence,
      // so that models that only use raw components can work
      const renderer = getFormRenderer(this.rendererName)
      component = renderer[control.as]
    } else {
      component = control.as
    }
  
    if (!component) {
      throw new Error(`Missing render component for field "${control.name}" on form "${this.name}".`)
    }
  
    const attributes = Object.assign({}, control.props || {})
    const currentModelValue = getNestedObject(this.currentValue, path)
  
    // Only controls with a name handle values
    const handlesValues = !!control.name
  
    // Add v-model support to dynamic leaf components
    if (handlesValues && !control.children) {
      attributes.modelValue = currentModelValue[control.name]
      attributes['onUpdate:modelValue'] = (value) => {
        currentModelValue[control.name] = value
        this.context.emit('update:modelValue', this.currentValue)
      }
    }
  
    return h(component, attributes, {
      default: () => {
        return (control.children || []).map((child) => {
          return this.renderControl(
            child,
            [path, control.name].filter(Boolean).join('.'),
          )
        })
      },
    })
  }

  /**
   * Render the form into a VNode
   * 
   * @returns - A VNode that represents the UpForm component
   */
  render(): VNode {
    const formEl = h(
      'form',
      {
        class: 'upform-form',
        onSubmit: (event: Event) => {
          event.preventDefault()
          event.stopPropagation()
          this.context.emit('submit', this.currentValue)
        },
        onReset: (event: Event) => {
          event.preventDefault()
          event.stopPropagation()
          this.reset()
          this.context.emit('reset', this.currentValue)
        },
      },
      {
        default: () => {
          return this.config.fields.map((control) => {
            return this.renderControl(control)
          })
        },
      },
    )

    return h(
      'div',
      {
        class: 'upform-wrapper',
      },
      formEl,
    )
  }
}
