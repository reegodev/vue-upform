# vue-upform

Boost form development to the next level with declarative and reusable form definitions.<br><br>
This project aims to make Vue form development fast and scalable, without enforcing specific design or business logic constraints.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)

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

1. Create a form

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
    static: true,
    props: { label: 'Login' }, 
  },
])
```

2. Use the form you just registered inside another component

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



