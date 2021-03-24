<template>
  <div class="check-input mt-2">
    <label>
      <input type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)" />
      <span class="checkmark"></span>
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
<style scoped>
label {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
}
label:hover input ~ .checkmark {
  background-color: #ccc;
}
label input:checked ~ .checkmark {
  background-color: rgb(52, 211, 153);
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
label input:checked ~ .checkmark:after {
  display: block;
}
label .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
