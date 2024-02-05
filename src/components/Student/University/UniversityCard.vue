<script setup lang="ts">
import { useRouter } from "vue-router"

defineProps<{
  id: number,
  url: string,
  name: string,
  specializationsCount: number,
  city: string,
  address: string
}>()

const router = useRouter()
</script>

<template>
  <div class="flex gap-4 mb-3">
    <img v-if="url" :alt="name" style="width: 140px; height: 140px; object-fit:  contain" class="surface-50 border-round-xl" :src="url"/>
    <div class="flex-1">
      <p class="font-semibold my-2">{{ name }}</p>
      <p class="text-gray-500 my-2">Мамандық саны: {{ specializationsCount }}</p>
      <p class="text-gray-500 my-2">{{ city }} қаласы, {{ address }}</p>
    </div>
    <Button
      class="align-self-center"
      icon="pi pi-arrow-right"
      rounded
      @click="router.push({ name: 'UniversityDetail', params: { id } })"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
