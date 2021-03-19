# vue-upform

Boost form development to the next level with declarative and reusable form definitions.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)

## Features

- 🎨 &nbsp; Declarative form rendering
- 📝 &nbsp; Declarative form model definition 
- ♻︎ &nbsp; Configure once, reuse multiple times
- ⛔️ &nbsp; Built-in universal validators
- ✉️ &nbsp; Built-in submission handlers
- 🎮 &nbsp; Fast prototyping with plugins for Tailwind, Bootstrap and Bulma renderers

## Installation

```bash
yarn add vue-upform
```
```bash
npm i vue-upform
```

## Quick start

1. Configure how forms look

```js
import { configureRenderer } from 'vue-upform'
import TextInput from '~/components/TextInput.vue'
import PasswordInput from '~/components/PasswordInput.vue'
import CheckboxInput from '~/components/CheckboxInput.vue'
import SubmitButton from '~/components/SubmitButton.vue'

configureRenderer({
  text: TextInput,
  password: TextInput,
  checkbox: CheckboxInput,
  submit: SubmitButton,
})
```

2. Register a form

```js
import { registerForm } from 'vue-upform'

registerForm('login', [
  {
    type: 'text'.
    name: 'email',
    props: { placeholder: 'Username' },
    validations: 'required|email',
  },
  {
    type: 'password'.
    name: 'password',
    props: { placeholder: 'password' },
    validations: 'required',
  },
  {
    type: 'checkbox'.
    name: 'rememberMe',
    props: { label: 'Remember me on this device' },
    validations: 'boolean',
  },
  {
    type: 'submit',
    props: { label: 'Login' }, 
  },
])
```

3. Use the form you just registered

```vue
<!-- Login.vue -->
<template>
  <UpForm name="login" @submit="handleSubmit" />
</template>
<script>
export default {
  setup() {
    return {
      handleSubmit({ payload, form }) {
        // handle your submission
      }
    }
  }
}
</script>
```



