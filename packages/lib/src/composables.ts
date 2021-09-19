const formContexts = new Map()

export const setFormContext = (id: string, context) => {
  formContexts.set(id, context)
}

export const unsetFormContext = (id: string) => {
  formContexts.delete(id)
}

export const useFormContext = () => {



}
