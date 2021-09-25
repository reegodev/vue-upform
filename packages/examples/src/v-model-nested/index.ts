import { createApp, defineComponent, ref } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, CheckInput, SubmitButton, Group, Title } from '../../components'

createForm({
  name: 'signup',
  fields: [
    {
      as: Group,
      name: 'credentials',
      children: [
        {
          as: Title,
          props: { text: 'Credentials' },
        },
        {
          as: TextInput,
          name: 'email',
          props: { label: 'Email' },
        },
        {
          as: TextInput,
          name: 'password',
          props: { type: 'password', label: 'Password' },
        },
      ]
    },
    {
      as: Group,
      name: 'profile',
      children: [
        {
          as: Title,
          props: { text: 'Personal information' },
        },
        {
          as: TextInput,
          name: 'firstName',
          props: { label: 'First name' },
        },
        {
          as: TextInput,
          name: 'lastName',
          props: { label: 'Last name' },
        },
        {
          as: Group,
          name: 'legal',
          children: [
            {
              as: Title,
              props: { text: 'Legal' },
            },
            {
              as: CheckInput,
              name: 'privacy',
              props: { label: 'I\'ve read and accept the privacy policy' }
            },
            {
              as: CheckInput,
              name: 'terms',
              props: { label: 'I accept the Terms of Service' }
            },
            {
              as: CheckInput,
              name: 'newsletter',
              props: { label: 'Subscribe to the newsletter' }
            },
          ]
        },
      ]
    },
    {
      as: SubmitButton,
      props: { label: 'Signup' },
    },
  ]
})

createApp({
  template: `<div id="#app">
    <Upform name="signup" v-model="model" class="bg-white p-4 rounded shadow-sm max-w-md" />
    <pre id="output">{{ model }}</pre>
  </div>`,
  components: {
    Upform,
  },
  setup() {
    const model = ref({})

    return {
      model,
    }
  },
}).mount('#app')
