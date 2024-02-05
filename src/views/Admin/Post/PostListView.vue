<script setup lang="ts">
import { useRouter } from "vue-router"
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import PostCard from "@/components/Admin/Post/PostCard"
import { getImageUrl } from "@/helpers/getters"
import Paginator, { type PageState } from "primevue/paginator"

const router = useRouter()

export interface IMediaFile {
  id: number,
  url: string
}

export interface IPost {
  id: number,
  title: string,
  description: string,
  mediaFiles: IMediaFile
}

const posts = ref<IPost[]>([])
const postsCount = ref(0)
const page = ref(1)
const size = ref(5)

const getPosts = async() => {
  try {
    const { data } = await http.get(`admin/posts`, {
      params: {
        page: page.value,
        size: size.value,
      }
    })
    posts.value = data?.items ?? []
    postsCount.value = data?.totalCount ?? []
  } catch(err) {
    console.error(err)
    throw err
  }
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  getPosts()
}

onMounted(getPosts)
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <h1 class="font-semibold">Новости</h1>
    <Button
        label="+ Новый пост"
        @click="router.push({ name: 'AdminPostCreate' })"
    />
  </div>
  <div class="flex flex-column" style="max-width: 800px">
    <PostCard
        v-for="post in posts"
        :key="post.id"
        :post-id="post.id"
        :title="post.title"
        :image-src="post.mediaFiles ? getImageUrl(post.mediaFiles.url) : undefined"
    />
    <Paginator
        v-model="page"
        class="mb-5"
        :rows="size"
        :total-records="postsCount"
        @page="onPageChange"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
