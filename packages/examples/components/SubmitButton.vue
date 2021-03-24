<template>
  <div class="mt-4">
    <button type="submit" class="p-2 bg-green-400 text-white w-full rounded">{{ label }}</button>
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
