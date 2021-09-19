import {
  Component,
  AsyncComponentLoader,
} from 'vue'

export interface FormControl {
  name?: string
  as: string | Component | AsyncComponentLoader
  initialValue?: unknown
  props?: Record<string, unknown>
  rules?: string | string[]
  children?: FormControl[]
}

export interface FormConfig {
  name: string
  renderer?: string
  extends?: string
  fields: FormControl[]
}

export const configs: Map<string, FormConfig> = new Map()

export const createForm = (params: FormConfig): void => {
  if (configs.has(params.name)) {
    throw new Error(`A form named "${params.name}" is already present.`)
  }

  const defaultParams = {
    name: params.name,
    renderer: 'default',
    extends: '',
    fields: []
  }

  configs.set(params.name, Object.assign(defaultParams, params))
}
