import { createApp } from 'vue'
import { createForm, Upform, createFormRenderer } from 'vue-upform'
import { TextInput, TextInputVariant, CheckInput, CheckInputVariant, SubmitButton, SubmitButtonVariant } from '../../components'

createFormRenderer({
  'text': TextInput,
  'check': CheckInput,
  'submit': SubmitButton,
})

createFormRenderer('outline', {
  'text': TextInputVariant,
  'check': CheckInputVariant,
  'submit': SubmitButtonVariant,
})

createForm('login', [
  {
    as: 'text',
    name: 'email',
    props: {
      placeholder: 'Email'
    }
  },
  {
    as: 'text',
    name: 'password',
    props: { placeholder: 'Password', type: 'password' },
  },
  {
    as: 'check',
    name: 'rememberMe',
    props: { label: 'Remember me on this device' },
  },
  {
    as: 'submit',
    props: { label: 'Login' },
  },
])

createForm('payment', {
  renderer: 'outline',
  fields: [
    {
      as: 'text',
      name: 'cardHolder',
      props: {
        placeholder: 'Full name'
      }
    },
    {
      as: 'text',
      name: 'cardNumber',
      props: {
        placeholder: 'Card number'
      }
    },
    {
      as: 'check',
      name: 'saveCard',
      props: { label: 'Save card details' },
    },
    {
      as: SubmitButton,
      props: { label: 'Pay' },
    },
  ]
})

createApp({
  template: `<div id="#app">
    <div class="flex space-x-2">
      <div class="w-1/3 max-w-md">
        <h2 class="mb-2 text-xs font-medium uppercase">Default renderer</h2>
        <Upform name="login" class="bg-white p-4 rounded shadow-sm renderer-default" />
      </div>
      <div class="w-1/3 max-w-md">
        <h2 class="mb-2 text-xs font-medium uppercase">Outline renderer</h2>
        <Upform name="login" use="outline" class="bg-white p-4 rounded shadow-sm renderer-outline" />
      </div>
      <div class="w-1/3 max-w-md">
        <h2 class="mb-2 text-xs font-medium uppercase">Outline renderer with submit override</h2>
        <Upform name="payment" class="bg-white p-4 rounded shadow-sm renderer-mixed" />
      </div>
    </div>
  </div>`,
  components: {
    Upform,
  },
}).mount('#app')
