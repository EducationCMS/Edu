<script setup lang="ts">
import Tag from "primevue/tag"
import { ref } from "vue"

interface IProps {
  login: string,
  password: string
}

const props = defineProps<IProps>()

const isCopied = ref(false)

const copyPassword = () => {
  const el = document.createElement('textarea');
  el.value = props.password;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  isCopied.value = true
}
</script>

<template>
  <div class="surface-100 border-round-2xl px-3 py-1">
    <p class="font-semibold">Логин: {{ login }}</p>
    <p class="flex align-items-center">
      <span class="font-semibold">Пароль: {{ password }}</span>
      <Tag class="ml-2 cursor-pointer" :value="isCopied ? 'Скопировано' : 'Скопировать'" severity="info" @click="copyPassword" />
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>
