<script setup lang="ts">
import Button from "primevue/button"
import { useRouter } from "vue-router"

const props = defineProps<{
  postId: number,
  title: string,
  imageSrc?: string,
  isStudent?: boolean
}>()

const router = useRouter()

const handleRouteChange = () => {
  router.push({ name: props.isStudent ? 'PostDetail' : 'AdminPostEdit', params: { id: props.postId } })
}
</script>

<template>
  <div class="my-3 border-1 border-300 border-round-sm shadow-1">
    <div class="px-5 pb-5">
      <h1 class="mb-0 mt-5 cursor-pointer" @click="handleRouteChange">{{ title }}</h1>
      <img v-if="imageSrc" :alt="title" class="shadow-2 mt-5" :src="imageSrc" style="width: 400px; height: auto" />
    </div>
    <div class="px-5 py-4 border-top-1 border-300 flex align-items-center">
      <span class="text-lg mr-5"><i class="pi pi-eye text-lg mr-2"></i> 0</span>
      <span class="text-lg"><i class="pi pi-comments text-lg mr-2"></i> 0</span>
      <Button
        label="Оқу"
        class="ml-auto px-5"
        @click="handleRouteChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
