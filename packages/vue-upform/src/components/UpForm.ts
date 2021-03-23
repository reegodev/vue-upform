import { defineComponent, provide, unref } from 'vue'
import { renderForm } from '../form'

export default defineComponent({
  name: 'UpForm',
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

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const formContext = {
      submit: () => {
        console.log(Math.random())
        console.log('submit')
      },
      reset: () => {
        console.log('reset')
      },
      model: unref(props.modelValue),
      emit,
    }

    provide('upform', formContext)
    return () => renderForm(props.name, formContext, props.use)
  },
})
