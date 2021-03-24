<template>
  <div class="check-input mt-2">
    <label>
      <input type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)" />
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'CheckInput',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: [
    'update:modelValue'
  ]
})
</script>
