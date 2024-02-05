<script setup lang="ts">
import { defineModel, reactive, ref, watch } from "vue"
import http from "@/plugins/axios"
import type { FileUploadUploaderEvent } from "primevue/fileupload"
import type { AxiosError } from "axios"
import Textarea from "primevue/textarea"

interface IFile extends FileUploadUploaderEvent {
  id: string,
  originalName: string,
  extensions: string
}

const props = defineProps(['taskId', 'topicId', 'topicName', 'isEdit'])
const emits = defineEmits(['close'])
const modelValue = defineModel<boolean>()

const task = reactive({
  name: '',
  description: '',
  mediaFiles: []
})
const task_answer_id = ref(0)
const task_answer = ref('')
const errors = ref({})
const is_creating = ref(false)
const file_is_uploading = ref(false)
const uploaded_files = ref<IFile[]>([])

const getTask = async(task_id: number|string) => {
  try {
    const { data } = await http.get('task/get-by-id/' + task_id)
    task.name = data?.name
    task.description = data?.description
    task.mediaFiles = data?.mediaFiles || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getTaskAnswer = async(task_id: number|string) => {
  try {
    const { data } = await http.get('task-answer/get-by-task-user/' + task_id)
    task_answer_id.value = data?.id
    task_answer.value = data?.description
    uploaded_files.value = data?.mediaFiles || []
    // task.name = data?.name
    // task.description = data?.description
    // task.mediaFiles = data?.mediaFiles || []
    console.log(data)
  } catch(e) {
    console.error(e)
    throw e
  }
}


const createTaskAnswer = async() => {
  is_creating.value = true
  errors.value = {}
  try {
    const payload = {
      ...(props.isEdit && { id: task_answer_id.value }),
      task: { id: props.taskId },
      description: task_answer.value,
      // deadline: new Date(task.deadline).toLocaleDateString() + " " + new Date(task.deadline).toLocaleTimeString(),
      mediaFiles: uploaded_files.value.map(file => {
        return {
          id: file.id
        }
      })
    }
    const { data } = props.isEdit ? await http.patch('task-answer/update', payload) : await http.post('task-answer/create', payload)

    emits('close')
  } catch(e) {
    const error = e as AxiosError
    errors.value = error?.response?.data?.fieldErrors ?? {}
    throw e
  } finally {
    is_creating.value = false
  }
}

const uploadFile = async(file: File) => {
  file_is_uploading.value = true
  try {
    const { data } = await http.post('media/upload-file', {
      file: file,
      type: 'UserMaterials'
    }, { headers: { "Content-Type": "multipart/form-data" } })
    return data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    file_is_uploading.value = false
  }
}

const deleteFile = async(id: string) => {
  try {
    await http.delete(`media/delete-file/${id}`)
    uploaded_files.value = uploaded_files.value.filter(file => file.id !== id)
  } catch(e) {
    console.error(e)
    throw e
  }
}

const uploadFiles = async(event: FileUploadUploaderEvent) => {
  const files = event.files as File[]
  for(const file of files) {
    const uploadedFile = await uploadFile(file)
    uploaded_files.value = [...uploaded_files.value, uploadedFile]
  }
}

const downloadFile = async(file: IFile) => {
  try {
    // var link = document.createElement('a');
    // link.href = import.meta.env.VITE_BASE_URL + '/media/get-content/' + file.id;
    // link.download = file.originalName;
    // link.style.display = 'none';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    const { data } = await http.get(`media/get-content/${file.id}`, { responseType: "blob" })
    // const blob = new Blob([data], { type: file.extensions });
    // console.log(blob)
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch(e) {
    console.error(e)
    throw e
  }
}

const onDialogClose = () => {
  task_answer_id.value = 0
  task_answer.value = ''
  uploaded_files.value = []
}

watch(() => props.taskId, (newValue) => {
  if(newValue && newValue > 0) {
    getTask(newValue)
    if(props.isEdit) getTaskAnswer(newValue)
  }
})
</script>

<template>
  <Dialog v-model:visible="modelValue" modal header=" " :style="{ width: '60vw' }" @after-hide="onDialogClose">
    <h2 class="mt-0 text-2xl mb-4">Тапсырманы жіберу</h2>
    <div class="mb-4">
      <p class="text-600 font-medium mb-2">Тақырыбы</p>
      <p class="my-0 font-medium">{{ task.name }}</p>
    </div>
    <div class="mb-4">
      <p class="text-600 font-medium mb-2">Тапсырма сипаттамасы</p>
      <p class="my-0">{{ task.description ?? '...' }}</p>
    </div>
    <div v-if="task.mediaFiles.length > 0" class="mb-4">
      <p class="text-600 font-medium mb-3">Материалдар</p>
      <div class="flex flex-wrap gap-4">
        <Tag
          v-for="file in task.mediaFiles"
          :key="file.id"
          :value="file.originalName"
          class="px-4 py-3 text-sm cursor-pointer"
          @click="downloadFile(file)"
        />
      </div>
    </div>
    <h2 class="mt-0 text-2xl mb-4">Тапсыру</h2>
    <div>
      <p>Тапсырмаға түсіндірме жазып файлды жүктеңіз</p>
      <Textarea v-model="task_answer" class="w-full mb-4" rows="5"/>
      <FileUpload
        auto
        mode="basic"
        custom-upload
        :maxFileSize="1000000"
        :choose-label="file_is_uploading ? 'Загружается' : 'Қосу'"
        upload-label="Жүктеу"
        cancel-label="Отмена"
        :disabled="file_is_uploading"
        @uploader="uploadFiles"
      >
        <template #empty>
          <p class="my-0">Файлдарды жүктеңіз</p>
        </template>
      </FileUpload>
      <div class="mt-3 flex flex-wrap gap-2">
        <Tag v-for="file in uploaded_files" :key="file.id">
          <div class="flex align-items-center gap-2 px-2 py-1">
            <span class="text-base">{{ file.originalName }}</span>
            <i class="pi pi-times text-xs cursor-pointer" @click="deleteFile(file.id)"></i>
          </div>
        </Tag>
      </div>
    </div>
    <div class="flex justify-content-end">
      <Button
        class="mt-4"
        label="Тексеруге жіберу"
        :loading="is_creating"
        :disabled="!task_answer"
        @click="createTaskAnswer"
      />
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
