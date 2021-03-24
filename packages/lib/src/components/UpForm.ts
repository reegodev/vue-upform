import { defineComponent, provide } from 'vue'
import { renderForm, createFormContext } from '../form'

export default defineComponent({
  name: 'Upform',
  props: {
    name: {
      type: String,
      required: true,
    },
    use: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['update:modelValue', 'submit', 'reset'],

  setup(props, ctx) {
    const formContext = createFormContext(props.modelValue, ctx)

    provide('upform', formContext)
    return () => renderForm(props.name, formContext, props.use)
  },
})
