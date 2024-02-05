<script setup lang="ts">
import { defineModel, defineProps } from "vue"

defineProps(['label', 'error'])
const modelValue = defineModel()
</script>

<template>
  <div>
    <label for="phone" class="font-semibold block mb-2">{{ label }}</label>
    <div class="flex align-items-center gap-2">
      <div class="phone-input__code">
        <span>+7</span>
      </div>
      <InputMask
        v-model="modelValue"
        id="phone"
        date="phone"
        mask="(999) 999-9999"
        placeholder="(777) 000-0000"
        unmask
        :class="[!!error && 'p-invalid']"
      />
    </div>
    <small v-if="error" class="p-error" id="email_error">{{ error ?? '&nbsp;'  }}</small>
  </div>
</template>

<style scoped lang="scss">
.phone-input__code {
  border-radius: 10px;
  border: 1px solid #ced4da;
  height: 45px;
  display: grid;
  place-items: center;
  padding: 0 1.5rem;
}
</style>
