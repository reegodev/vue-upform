import { createApp } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, CheckInput, SubmitButton } from '../../components'

createForm('login', [
  {
    as: TextInput,
    name: 'email',
    initialValue: 'you@domain.com',
  },
  {
    as: TextInput,
    name: 'password',
    initialValue: 'password',
    props: { type: 'password' },
  },
  {
    as: CheckInput,
    name: 'rememberMe',
    initialValue: true,
    props: { label: 'Remember me on this device' },
  },
  {
    as: SubmitButton,
    props: { label: 'Login' },
  },
])

createApp({
  template: `<div id="#app">
    <Upform name="login" class="bg-white p-4 rounded shadow-sm max-w-md" />
  </div>`,
  components: {
    Upform,
  },
}).mount('#app')
