<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import PostCard from "@/components/Admin/Post/PostCard"
import { getImageUrl } from "@/helpers/getters"
import type { IPost } from "@/views/Admin/Post/PostListView.vue"

const posts = ref<IPost[]>([])

const getPosts = async() => {
  try {
    const { data } = await http.get(`post/get-all`)
    posts.value = data?.items ?? []
  } catch(err) {
    console.error(err)
    throw err
  }
}

onMounted(getPosts)
</script>

<template>
  <h1 class="font-semibold">Жаңалықтар</h1>
  <div class="flex flex-column" style="max-width: 800px">
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post-id="post.id"
      :title="post.title"
      is-student
      :image-src="post.mediaFiles ? getImageUrl(post.mediaFiles.url) : undefined"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
