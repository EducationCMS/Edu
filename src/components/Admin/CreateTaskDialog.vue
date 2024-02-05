<script setup lang="ts">
import { defineModel, reactive, ref, watch } from "vue"
import Input from "@/components/Form/Input.vue"
import Textarea from "primevue/textarea"
import http from "@/plugins/axios"
import type { FileUploadUploaderEvent } from "primevue/fileupload"
import type { AxiosError } from "axios"

interface IFile extends FileUploadUploaderEvent {
  id: string,
}

const props = defineProps(['taskId', 'topicId', 'topicName'])
const emits = defineEmits(['close'])
const modelValue = defineModel<boolean>()

const task = reactive({
  name: '',
  description: '',
  mediaFiles: []
})
const errors = ref({})
const is_creating = ref(false)
const file_is_uploading = ref(false)
const uploaded_files = ref<IFile[]>([])

const getTask = async(task_id: number|string) => {
  try {
    const { data } = await http.get('admin/tasks/' + task_id)
    console.log(data)
    task.name = data?.name
    task.description = data?.description
    uploaded_files.value = data?.mediaFiles || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const createTask = async() => {
  is_creating.value = true
  errors.value = {}
  try {
    const { data } = await http.put('admin/tasks', {
      id: props.taskId,
      topic: {
        id: props.topicId
      },
      ...task,
      // deadline: new Date(task.deadline).toLocaleDateString() + " " + new Date(task.deadline).toLocaleTimeString(),
      mediaFiles: uploaded_files.value.map(file => {
        return {
          id: file.id
        }
      })
    })
    emits('close')
  } catch(e) {
    const error = e as AxiosError
    errors.value = error.response?.data?.fieldErrors ?? {}
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
      type: 'TaskMaterials'
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

const onDialogClose = () => {
  task.name = ''
  task.description = ''
  uploaded_files.value = []
}

watch(() => props.taskId, (newValue) => {
  if(newValue && newValue > 0) {
    getTask(newValue)
  }
})
</script>

<template>
  <Dialog v-model:visible="modelValue" modal header="Жаңа тапсырма жасау" :style="{ width: '40vw' }" @after-hide="onDialogClose">
    <div class="formgrid grid">
      <div class="field col-6">
        <Input v-model="task.name" label="Тапсырма атауы" :error="errors['name']"/>
      </div>
      <div class="field col-12">
        <label class="font-semibold">Тапсырма туралы</label>
        <Textarea v-model="task.description" rows="5" :class="[!!errors['description'] && 'p-invalid']" style="width: 100%"/>
        <small v-if="errors['description']" class="p-error">{{ errors['description'] ?? '&nbsp;'  }}</small>
      </div>
<!--      <div class="field col-12">-->
<!--        <label for="deadline_date" class="font-semibold">Дедлайн</label>-->
<!--        <Calendar-->
<!--          v-model="task.deadline"-->
<!--          id="deadline_date"-->
<!--          date-format="yy-mm-dd"-->
<!--          :manualInput="false"-->
<!--          show-icon-->
<!--          show-time-->
<!--          hour-format="24"-->
<!--          hide-on-date-time-select-->
<!--        />-->
<!--      </div>-->
      <div class="field col-12 mt-4">
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
      <div class="field col-12 flex justify-content-end">
        <Button
          class="mt-4"
          label="Сақтау"
          :loading="is_creating"
          @click="createTask"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
