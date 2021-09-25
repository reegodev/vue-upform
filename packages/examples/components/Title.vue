<template>
  <h2 class="text-sm uppercase font-bold mb-4">{{ text }}</h2>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    }
  }
})
</script>
