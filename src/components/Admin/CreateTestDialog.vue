<script setup lang="ts">
import Dialog from "primevue/dialog"
import Textarea from "primevue/textarea"
import { defineModel, ref, watch } from "vue"
import http from "@/plugins/axios"
import type { FileUploadUploaderEvent } from "primevue/fileupload"
import FileUpload from "primevue/fileupload"
import Checkbox from "primevue/checkbox"
import Dropdown from "primevue/dropdown"
import Editor from "primevue/editor"

const props = defineProps(['testId', 'topicName'])
const emits = defineEmits(['close'])

export interface IOption {
  id?: number,
  text: string,
  isRight: boolean,
  checked: boolean
  // question: string
}

export interface IQuestion {
  id?: number,
  question: string,
  mediaFiles: { id: string }[],
  options: IOption[],
  multipleAnswers: boolean
}

const QUESTION_BODY: IQuestion = {
  question: '',
  mediaFiles: [],
  multipleAnswers: false,
  options: [
    {
      text: '',
      checked: false,
      isRight: false,
    }
  ]
}

const questions = ref<IQuestion[]>([structuredClone(QUESTION_BODY)])
const active_question = ref(0)
const modelValue = defineModel<boolean>()
const is_creating = ref(false)
const file_is_uploading = ref(false)
const uploaded_files = ref<File[][]>([[]])
const description = ref('')
const selectedType = ref('')
const testTypes = ref([
  { name: 'Контрольный', value: 'Control' },
  { name: 'Групповой', value: 'Context' },
])

const addQuestion = () => {
  questions.value = [...questions.value, structuredClone(QUESTION_BODY)]
  uploaded_files.value = [...uploaded_files.value, []]
  active_question.value++
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
  uploaded_files.value.splice(index, 1)
  active_question.value = index - 1
}

const removeQuestionOption = (index: number, option_index: number) => {
  questions.value[index].options.splice(option_index, 1)
}


const addQuestionOption = (question_idx: number) => {
  questions.value[question_idx].options = [...questions.value[question_idx].options, {
    text: '',
    checked: false,
    isRight: false,
  }]
}

const getTest = async(test_id: number|string) => {
  try {
    const { data } = await http.get('admin/app-tests/' + test_id)
    if(data?.questions.length) questions.value = data?.questions
    selectedType.value = data?.type
    description.value = data?.description
    uploaded_files.value = questions.value.map(question => {
      return question.mediaFiles ?? []
    })
  } catch(e) {
    console.error(e)
    throw e
  }
}

const uploadFile = async(file: File) => {
  file_is_uploading.value = true
  try {
    const { data } = await http.post('media/upload-file', {
      file: file,
    }, { headers: { "Content-Type": "multipart/form-data" } })
    return data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    file_is_uploading.value = false
  }
}

const uploadFiles = async(event: FileUploadUploaderEvent, index: number) => {
  console.log(event, index)
  const files = event.files ?? []
  for(const file of files) {
    const uploadedFile = await uploadFile(file)
    uploaded_files.value[index] = [...uploaded_files.value[index], uploadedFile]
    questions.value[index].mediaFiles = [...(questions.value[index].mediaFiles ?? []), { id: uploadedFile.id }]
  }
}

const deleteFile = async(id: string, index: number) => {
  try {
    await http.delete(`media/delete-file/${id}`)
    uploaded_files.value[index] = uploaded_files.value[index].filter(file => file.id !== id)
    questions.value[index].mediaFiles = (questions.value[index].mediaFiles || []).filter(file => file.id !== id)
  } catch(e) {
    console.error(e)
    throw e
  }
}

const saveTest = async() => {
  is_creating.value = true
  try {
    const { data } = await http.put('admin/app-tests/', {
      id: props.testId,
      name: props.topicName,
      ...(selectedType.value === 'Context' && { description: description.value }),
      type: selectedType.value,
      questions: questions.value
    })
    emits('close')
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_creating.value = false
  }
}

const onDialogClose = () => {
  active_question.value = 0
  questions.value = [{ ...QUESTION_BODY }]
  uploaded_files.value = [[]]
}

watch(() => props.testId, (newValue) => {
  if(newValue && newValue > 0) {
    getTest(newValue)
  }
})
</script>

<template>
  <Dialog v-model:visible="modelValue" modal :header="`${topicName} | Тест өзгерту`" :style="{ width: '50vw' }" @after-hide="onDialogClose">
    <div class="py-2">
<!--      <Textarea v-if="selectedType === 'Context'" v-model="description" autoResize rows="2" class="w-full" placeholder="Сипаттама" />-->
      <Editor v-if="selectedType === 'Context'" v-model="description" editor-style="height: 250px" class="w-full" placeholder="Сипаттама" />
      <div class="flex w-full gap-2 mt-3">
        <div v-if="active_question > 0">
          <Button
            icon="pi pi-arrow-left"
            rounded
            @click="active_question--"
          />
        </div>
        <template
          v-for="(question, qIdx) in questions"
          :key="`question-${qIdx}`"
        >
          <div v-if="active_question === qIdx" class="scalein animation-duration-200 border-1 border-400 test-card border-left-none px-4 py-3 flex-1">
            <div class="flex align-items-center justify-content-between">
              <div class="flex align-items-center mb-3 gap-4">
                <span class="font-semibold">Сұрақ №{{ qIdx + 1 }}</span>
                <div class="flex align-items-center">
                  <Checkbox v-model="question.multipleAnswers" inputId="multiple-answers" binary />
                  <label for="multiple-answers" class="ml-2">Бірнеше жауап</label>
                </div>
              </div>
              <Button
                v-if="qIdx > 0"
                size="sm"
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                @click="removeQuestion(qIdx)"
              />
            </div>
            <Textarea v-model="question.question" auto-resize class="w-full" placeholder="Сұрақ" />
            <FileUpload
              class="mt-3"
              auto
              mode="basic"
              custom-upload
              :maxFileSize="1000000"
              :choose-label="file_is_uploading ? 'Загружается' : 'Файл жүктеу'"
              upload-label="Жүктеу"
              cancel-label="Отмена"
              :disabled="file_is_uploading"
              @uploader="uploadFiles($event, qIdx)"
            >
              <template #empty>
                <p class="my-0">Файлдарды жүктеңіз</p>
              </template>
            </FileUpload>
            <div v-if="uploaded_files[qIdx].length" class="mt-3 mb-3 flex flex-wrap gap-2">
              <Tag v-for="file in uploaded_files[qIdx]" :key="file.id">
                <div class="flex align-items-center gap-2 px-2 py-1">
                  <span class="text-base">{{ file.originalName }}</span>
                  <i class="pi pi-times text-xs cursor-pointer" @click="deleteFile(file.id, qIdx)"></i>
                </div>
              </Tag>
            </div>
            <div class="is-divider my-4"></div>
            <div class="mt-2">
              <div v-for="(option, oIdx) of question.options" :key="`q${qIdx}-o${oIdx}`" class="flex align-items-center mb-3">
                <Checkbox v-model="option.isRight" binary :inputId="`question${qIdx}_option${oIdx}`" />
                <InputText v-model="option.text" type="text" class="p-inputtext-sm mx-2 flex-1" :placeholder="`Вариант ${oIdx+1}`" @keyup.enter="addQuestionOption(qIdx)" />
                <i class="pi pi-times-circle cursor-pointer" @click="removeQuestionOption(qIdx, oIdx)"></i>
              </div>
              <p class="text-xs text-500">Дұрыс жауаптарды таңдаңыз</p>
              <Button
                size="sm"
                text
                label="+ Вариант қосу"
                @click="addQuestionOption(qIdx)"
              />
            </div>
          </div>
        </template>
        <div>
          <Button
            v-if="questions.length-1 === active_question"
            icon="pi pi-plus"
            rounded
            @click="addQuestion"
          />
          <Button
            v-else
            icon="pi pi-arrow-right"
            rounded
            @click="active_question++"
          />
        </div>
      </div>
      <div class="flex justify-content-between align-items-center mt-5">
        <Dropdown
          v-model="selectedType"
          :options="testTypes"
          option-label="name"
          option-value="value"
        />
        <Button
          label="Сақтау"
          :loading="is_creating"
          @click="saveTest"
        />
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
.test-card {
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    background-color: #566df6;
    width: 5px;
  }
}

.is-divider {
  width: 100%;
  background-color: #CACED8;
  height: 1px;
}
</style>
