import { Component, AsyncComponentLoader } from 'vue'

export type FormRendererConfig = Record<
  string,
  Component | AsyncComponentLoader
>

const renderers: Map<string, FormRendererConfig> = new Map()

export function createFormRenderer(cfg: FormRendererConfig): void
export function createFormRenderer(name: string, cfg: FormRendererConfig): void
export function createFormRenderer(
  nameOrCfg: string | FormRendererConfig,
  cfg?: FormRendererConfig,
): void {
  let name = 'default'
  let config: FormRendererConfig = {}

  if (typeof nameOrCfg === 'string') {
    name = nameOrCfg
    config = cfg
  } else {
    config = nameOrCfg
  }

  if (typeof config !== 'object' || Object.keys(config).length === 0) {
    throw new Error('Invalid renderer config.')
  }

  if (renderers.has(name)) {
    throw new Error(`Renderer "${name}" has already been registered.`)
  }

  renderers.set(name, config)
}

export function getFormRenderer(name: string): FormRendererConfig {
  if (!renderers.has(name)) {
    throw new Error(`Cannot find renderer "${name}".`)
  }

  return renderers.get(name)
}
