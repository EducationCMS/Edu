<script setup lang="ts">
import { reactive, ref } from "vue"
import Editor from "primevue/editor"
import type { FileUploadUploaderEvent } from "primevue/fileupload"
import FileUpload from "primevue/fileupload"
import Button from "primevue/button"
import http from "@/plugins/axios"
import { getImageUrl } from "@/helpers/getters"
import { useRouter } from "vue-router"

const router = useRouter()

const postForm = reactive({
  title: '',
  description: '',
})
const fileIsUploading = ref(false)
const uploadedFile = ref()
const isCreating = ref(false)

const uploadFile = async(file: File) => {
  fileIsUploading.value = true
  try {
    const { data } = await http.post('media/upload-file', {
      file,
    }, { headers: { "Content-Type": "multipart/form-data" } })
    return data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    fileIsUploading.value = false
  }
}

const deleteFile = async(id: string) => {
  try {
    await http.delete(`media/delete-file/${id}`)
    uploadedFile.value = undefined
  } catch(e) {
    console.error(e)
    throw e
  }
}

const uploadFiles = async(event: FileUploadUploaderEvent) => {
  console.log(event)
  const file = event.files?.at(0)
  uploadedFile.value = await uploadFile(file)
  console.log(uploadedFile.value)
}

const createPost = async() => {
  isCreating.value = true
  try {
    await http.post(`admin/posts`, {
      ...postForm,
      mediaFiles: uploadedFile.value
    })
    await router.push({ name: 'AdminPostList' })
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <h1 class="font-semibold">Новый пост</h1>
  <div class="mt-7" style="max-width: 800px">
    <div class="field">
      <label for="title" class="font-semibold">Название поста</label>
      <InputText id="title" name="title" :style="{ width: '600px' }" v-model="postForm.title" />
    </div>
    <div class="field mt-4">
      <label for="description" class="font-semibold">Текст</label>
      <Editor v-model="postForm.description" editor-style="height: 250px" />
    </div>
    <div class="field mt-4">
      <label for="photo" class="font-semibold">Фотография поста</label>
      <div v-if="!!uploadedFile" class="relative w-fit">
        <img :src="getImageUrl(uploadedFile.url)" style="max-width: 800px; height: auto" />
        <Button icon="pi pi-trash" severity="danger" rounded class="absolute" style="right: 1rem; top: 1rem" @click="deleteFile(uploadedFile.id)"></Button>
      </div>
      <FileUpload
          v-else
          auto
          mode="basic"
          custom-upload
          :maxFileSize="1000000"
          :choose-label="fileIsUploading ? 'Загружается' : 'Добавить'"
          upload-label="Загрузить"
          cancel-label="Отмена"
          :accept="'image/*'"
          :disabled="fileIsUploading"
          @uploader="uploadFiles"
      >
        <template #empty>
          <p class="my-0">Загрузите файлы</p>
        </template>
      </FileUpload>
    </div>
    <div class="flex justify-content-end mt-3">
      <Button severity="success" label="Сохранить" class="px-6" :disabled="isCreating" @click="createPost"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
