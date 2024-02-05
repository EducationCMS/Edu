<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import Avatar from "primevue/avatar"
import type { IUser } from "@/stores/user"
import type { IPost } from "@/views/Admin/Post/PostListView.vue"
import { getImageUrl } from "@/helpers/getters"
import ProgressSpinner from "primevue/progressspinner"

export interface IComment {
  id: number,
  appUser: IUser,
  dateTime: string,
  text: string,
  type: 'Post'|'University'|'Specialization',
  post?: IPost
}

const props = defineProps<{
  model: 'Post'|'Specialization'|'University',
  modelId: number,
}>()

const text = ref('')
const comments = ref<IComment[]>([])
const isLoading = ref(false)
const isCreating = ref(false)

const getComments = async() => {
  if(props.model) {
    isLoading.value = true
    try {
      const { data } = await http.get(`comment/get-all-by-${props.model.toLowerCase()}/${props.modelId}`)
      comments.value = data ?? []
    } catch(e) {
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }
}

const createComment = async() => {
  isCreating.value = true
  try {
    const { data } = await http.post('comment/save', {
      [props.model.toLowerCase()]: { id: props.modelId },
      text: text.value,
      type: props.model
    })

    // comments.value = [...comments.value, data]
    getComments()
    text.value = ''
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isCreating.value = false
  }
}

const getInitials = (comment: IComment) => {
  if(!comment.appUser || (!comment.appUser.firstName && !comment.appUser.lastName )) return '?'

  return comment.appUser.lastName?.charAt(0) ?? '' + comment.appUser.firstName?.charAt(0) ?? ''
}

onMounted(getComments)
</script>

<template>
  <div class="flex flex-column mt-3">
    <div v-if="isLoading" class="flex justify-content-center">
      <ProgressSpinner />
    </div>
    <template v-else-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="flex gap-2 mt-4">
        <Avatar
          class="w-4rem h-4rem text-3xl"
          shape="circle"
          :image="getImageUrl(comment.appUser.avatar)"
        />
        <div class="flex-1">
          <p class="font-semibold mb-0" style="margin-top: 10px">{{ comment.appUser.login }}</p>
          <p class="mb-0 mt-1">{{ comment.text }}</p>
        </div>
      </div>
    </template>
    <p v-else class="text-gray-600 text-lg">Бірінші боп сұрақ қалдырыңыз</p>
  </div>
  <div class="flex gap-3 my-5">
    <InputText v-model="text" class="flex-1 border-round-lg" placeholder="Сіздің сұрағыңыз..." />
    <Button :disabled="!text || isCreating" :loading="isCreating" label="Жіберу" @click="createComment" />
  </div>
</template>

<style scoped lang="scss">

</style>
