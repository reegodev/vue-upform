import { createApp, defineComponent } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, SubmitButton } from '../components'

createForm('login', [
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
    as: SubmitButton,
    props: { label: 'Login' },
  },
])

createApp({
  template: `<div id="#app">
    <Upform name="login" v-model="model" class="bg-white p-4 rounded shadow-sm max-w-md" />
    <pre id="output">{{ model }}</pre>
  </div>`,
  components: {
    Upform,
  },
  data() {
    return {
      model: {
        email: 'asd',
        password: 'asdasd',
      },
    }
  },
}).mount('#app')
