import { createApp, defineComponent, ref } from 'vue'
import { createForm, Upform } from 'vue-upform'
import { TextInput, SubmitButton, Row, Col } from '../../components'

createForm('payment', [
  {
    as: TextInput,
    name: 'holderName',
    props: { label: 'Full name' },
  },
  {
    as: Row,
    children: [
      {
        as: Col,
        props: { width: '1/6' },
        children: [
          {
            as: TextInput,
            name: 'holderBirthDay',
            props: { label: 'Day' },
          },
        ]
      },
      {
        as: Col,
        props: { width: '1/2' },
        children: [
          {
            as: TextInput,
            name: 'holderBirthMonth',
            props: { label: 'Month' },
          },
        ]
      },
      {
        as: Col,
        props: { width: '1/3' },
        children: [
          {
            as: TextInput,
            name: 'holderBirthYear',
            props: { label: 'Year' },
          },
        ]
      }
    ]
  },
  {
    as: Row,
    children: [
      {
        as: Col,
        props: { width: '2/3' },
        children: [
          {
            as: TextInput,
            name: 'cardNumber',
            props: { label: 'Card number' },
          },
        ]
      },
      {
        as: Col,
        props: { width: '1/3' },
        children: [
          {
            as: TextInput,
            name: 'cardSecurityCode',
            props: { label: 'CVV' },
          },
        ]
      },
    ]
  },
  {
    as: SubmitButton,
    props: { label: 'Signup' },
  },
])

createApp({
  template: `<div id="#app">
    <Upform name="payment" v-model="model" class="bg-white p-4 rounded shadow-sm max-w-md" />
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
