import { defineComponent, provide, SetupContext, EmitsOptions } from 'vue'
import { Form } from '../FormInstance'

export default defineComponent({
  name: 'Upform',
  props: {
    name: {
      type: String,
      required: true,
    },
    renderer: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Object,
      default: null,
    },
  },

  emits: ['update:modelValue', 'submit', 'reset'],

  setup(props, ctx) {
    const form = new Form({
      name: props.name,
      renderer: props.renderer,
      initialValue: props.modelValue,
    }, ctx as SetupContext<EmitsOptions>)

    return () => form.render()
  },
})
