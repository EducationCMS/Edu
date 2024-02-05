<script setup lang="ts">
import { useRouter } from "vue-router"

defineProps<{
  id: number,
  name: string,
  code: string,
  grandCount: number,
  grandScore: number
}>()

const router = useRouter()
</script>

<template>
  <div class="flex align-items-center shadow-1 border-round-lg p-4">
    <div class="flex-1">
      <p class="font-semibold my-0">{{ name }}</p>
      <p class="text-gray-500 mt-3 mb-0">Код: {{ code }}</p>
      <p class="text-primary font-semibold mt-3 mb-0">Грант саны: {{ grandCount }}</p>
      <p class="text-primary font-semibold mt-3 mb-0">Грантқа шекті балл: {{ grandScore }}</p>
    </div>
    <Button rounded icon="pi pi-arrow-right" @click="router.push({ name: 'SpecializationDetail', params: { id } })"/>
  </div>
</template>

<style scoped lang="scss">

</style>
