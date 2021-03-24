<template>
  <div class="text-input mb-4">
    <label v-if="label">{{ label }}</label>
    <input class="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent" :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: 'TextInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => {
        return ['text', 'password', 'email', 'search', 'number', 'url', 'tel'].includes(value)
      }
    },
  },
  emits: [
    'update:modelValue'
  ]
})
</script>
