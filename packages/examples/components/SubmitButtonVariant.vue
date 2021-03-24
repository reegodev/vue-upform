<template>
  <div class="mt-4">
    <button type="submit" class="p-2 border border-green-400 text-green-400 w-full rounded">{{ label }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'SubmitButton',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
})
</script>
