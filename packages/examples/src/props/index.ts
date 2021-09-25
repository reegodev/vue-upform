import { createApp } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, CheckInput, SubmitButton } from '../../components'

createForm({
  name: 'login',
  fields: [
    {
      as: TextInput,
      name: 'email',
      props: {
        placeholder: 'Email'
      }
    },
    {
      as: TextInput,
      name: 'password',
      props: { placeholder: 'password', type: 'password' },
    },
    {
      as: CheckInput,
      name: 'rememberMe',
      props: { label: 'Remember me on this device' },
    },
    {
      as: SubmitButton,
      props: { label: 'Login' },
    },
  ]
})

createApp({
  template: `<div id="#app">
    <Upform name="login" class="bg-white p-4 rounded shadow-sm max-w-md" />
  </div>`,
  components: {
    Upform,
  },
}).mount('#app')
