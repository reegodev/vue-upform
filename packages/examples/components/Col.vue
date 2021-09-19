<template>
  <div :class="[ `w-${width}`, 'p-2' ]">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    width: {
      type: String,
      default: 'full'
    }
  }
})
</script>