<template>
  <h2 class="text-md uppercase">{{ text }}</h2>
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
