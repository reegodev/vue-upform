[![Build Status](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://img.shields.io/badge/vue-3.x.x-brightgreen.svg)
[![Build Status](https://github.com/reegodev/vue-upform/workflows/Node.js%20CI/badge.svg)](https://github.com/reegodev/vue-upform/actions)
[![npm version](https://img.shields.io/npm/v/vue-upform)](https://www.npmjs.com/package/vue-upform)
[![npm downloads](https://img.shields.io/npm/dt/vue-upform)](https://www.npmjs.com/package/vue-upform)

> HEADS-UP! This project is still in heavy development

<img src="/docs/public/vue-upform-logo.svg" alt="VueUpform logo" width="150" style="margin-top: 40px" />

# vue-upform

📝 ⚡️ Boost Vue form development to the next level with declarative and reusable form definitions.<br><br>
This project aims to make Vue form development fast and scalable, without enforcing specific design or business logic constraints.

## Features

- 📝 &nbsp; Declarative form model definition
- 🎨 &nbsp; Define multiple renderers to satisfy any design requirement
- ♻︎ &nbsp; Configure once, reuse multiple times
- ⛔️ &nbsp; [WIP] Built-in universal validators 
- ✉️ &nbsp; [WIP] Built-in submission handlers 
- 🎮 &nbsp; [WIP] Fast prototyping with plugins for most common UI libraries like Tailwind, Bootstrap, Bulma, etc.

## Installation

```bash
yarn add vue-upform
```
```bash
npm i vue-upform
```

## Quick start

1. Create a form<br>
To provide maximum flexibility, you are in charge of providing a component to render each field.<br>
The only requirement these components need to have is to support the `v-model` directive

```js
import { createForm } from 'vue-upform'
import TextInput from '~/components/TextInput.vue'
import PasswordInput from '~/components/PasswordInput.vue'
import CheckboxInput from '~/components/CheckboxInput.vue'
import SubmitButton from '~/components/SubmitButton.vue'

createForm('login', [
  {
    as: TextInput,
    name: 'email',
    props: { placeholder: 'Email' },
    rules: 'required|email',
  },
  {
    as: TextInput,
    name: 'password',
    props: { type: 'password', placeholder: 'password' },
    rules: 'required',
  },
  {
    as: CheckboxInput,
    name: 'rememberMe',
    initialValue: true,
    props: { label: 'Remember me on this device' },
    rules: 'boolean',
  },
  {
    as: SubmitButton,
    props: { label: 'Login' }, 
  },
])
```

2. Use the form you just registered inside another component

```vue
<!-- Login.vue -->
<template>
  <Upform name="login" @submit="handleSubmit" />
</template>
<script>
import { Upform } from 'vue-upform'
export default {
  components: { Upform },
  setup() {
    return {
      handleSubmit({ payload, status }) {
        // handle your submission
      }
    }
  }
}
</script>
```



