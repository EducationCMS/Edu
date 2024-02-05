<script setup lang="ts">
import { useRouter } from "vue-router"
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import type { IPost } from "@/views/Admin/Post/PostListView.vue"
import { getImageUrl } from "@/helpers/getters"
import Comments from "@/components/Student/Comments"

const props = defineProps(['id'])

const router = useRouter()

const post = ref<IPost>()

const getPost = async() => {
  try {
    const { data } = await http.get(`post/get-by-id/${props.id}`)
    post.value = data
  } catch(e) {
    console.error(e)
    throw e
  }
}

onMounted(getPost)
</script>

<template>
  <p class="font-semibold text-lg cursor-pointer mb-6"><span @click="router.go(-1)">{{ '< Жаңалықтар' }}</span></p>
  <template v-if="post">
    <div class="flex flex-column">
      <img v-if="post.mediaFiles" :src="getImageUrl(post.mediaFiles.url)" :alt="post.title" style="max-width: 500px; height: auto"/>
      <p class="font-semibold text-4xl mb-3">{{ post.title }}</p>
      <div v-html="post.description" />
      <div class="py-4 border-bottom-1 border-300 flex align-items-center">
        <span class="text-lg mr-5"><i class="pi pi-eye text-lg mr-2"></i> 3</span>
        <span class="text-lg"><i class="pi pi-comments text-lg mr-2"></i> 0</span>
      </div>
    </div>
    <Comments :model-id="post.id" :model="'Post'" />
  </template>
</template>

<style scoped lang="scss">

</style>
