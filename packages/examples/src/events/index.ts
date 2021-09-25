import { createApp, defineComponent } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, SubmitButton, ResetButton } from '../../components'

createForm({
  name: 'login', 
  fields: [
    {
      as: TextInput,
      name: 'email',
    },
    {
      as: TextInput,
      name: 'password',
      props: { type: 'password' },
    },
    {
      as: ResetButton,
      props: { label: 'Reset' },
    },
    {
      as: SubmitButton,
      props: { label: 'Login' },
    },
  ]
})

createApp({
  template: `<div id="#app">
    <Upform name="login" @reset="onReset" @submit="onSubmit" class="bg-white p-4 rounded shadow-sm max-w-md" />
    <pre id="output">{{ model }}</pre>
  </div>`,
  components: {
    Upform,
  },
  data() {
    return {
      model: {
        '@reset': null,
        '@submit': null,
      },
    }
  },
  methods: {
    onReset(event: any) {
      this.model['@reset'] = event
    },
    onSubmit(event: any) {
      this.model['@submit'] = event
    }
  }
}).mount('#app')
