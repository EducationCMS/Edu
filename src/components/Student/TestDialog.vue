<script setup lang="ts">
import { computed, defineModel, reactive, ref, watch } from "vue"
import http from "@/plugins/axios"
import type { IQuestion } from "@/components/Admin/CreateTestDialog.vue"
import Checkbox from "primevue/checkbox"
import CircleProgress from "vue3-circle-progress"
import "vue3-circle-progress/dist/circle-progress.css"

const props = defineProps(['testId', 'isFinished'])
const emits = defineEmits(['close', 'refresh'])
const modelValue = defineModel<boolean>()

const task = reactive({
  name: '',
  description: '',
  mediaFiles: []
})
const test_name = ref('')
const questions = ref<IQuestion[]>([])
const active_question = ref(0)
const selected_option = ref(null)
const errors = ref({})
const is_creating = ref(false)
const is_finished = ref(false)
const test_id = ref(0)
const test_result = ref(0)
const test_percentage = ref(0)
const test_total = ref(0)
const test_right_answers_count = ref(0)

const question = computed<IQuestion>(() => questions.value[active_question.value] || {})

const getTask = async(task_id: number|string) => {
  try {
    const { data } = await http.get('app-test/get-by-id/' + task_id)
    test_name.value = data?.name
    questions.value = data?.questions || []
    test_id.value = task_id
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getTestResult = async(task_id: number|string) => {
  try {
    const { data } = await http.get('app-test/get-result/' + task_id)
    test_result.value = data?.score
    test_right_answers_count.value = data?.rightAnswerCount
    test_total.value = data?.totalCount
    test_percentage.value = data?.percentage
  } catch(e) {
    console.error(e)
    throw e
  }
}

const finishTest = async() => {
  try {
    const { data } = await http.put('app-test/ended/' + test_id.value)
    await getTestResult(test_id.value)
    is_finished.value = true
    emits('refresh')
  } catch(e) {
    console.error(e)
    throw e
  }
}

const handleOptionClick = async(value: boolean, question_id: number, option_id: number) => {
  const payload = {
    id: option_id,
    value: value
  }
  try {
    const { data } = await http.post(`option/user-answer/${question_id}`, payload)
    console.log(data)
  } catch(e) {
    console.error(e)
    throw e
  }
}
const onDialogClose = () => {
  task.name = ''
  task.description = ''
  emits('close')
}

watch(() => props.testId, (newValue) => {
  if(newValue && newValue > 0) {
    getTask(newValue)
    getTestResult(newValue)
    is_finished.value = props.isFinished
  }
})
</script>

<template>
  <Dialog v-model:visible="modelValue" modal header=" " :style="{ width: '60vw' }" @after-hide="onDialogClose">
    <template v-if="is_finished">
      <div class="flex flex-column align-items-center">
        <h1 class="mb-6">Тест нәтижесі</h1>
        <CircleProgress
          size="150"
          :percent="test_percentage"
          show-percent
          border-bg-width="20"
          border-width="20"
          fill-color="#52CD9F"
        >{{ test_percentage }}%</CircleProgress>
        <p class="text-xl font-semibold">{{ test_right_answers_count }}/{{ test_total }}</p>
      </div>
    </template>
    <template v-else>
      <div class="px-6">
        <h2 class="mt-0 text-2xl mb-4">{{ test_name }}</h2>
        <div class="flex flex-wrap gap-1">
          <div
            v-for="(question, idx) in questions"
            :key="question.id"
            class="test__question_index cursor-pointer"
            :class="{ 'test__question_index--active': active_question === idx }"
            @click="active_question = idx"
          >
            {{ idx + 1 }}
          </div>
        </div>
        <div class="mt-5">
          <p class="text-xl mb-5">{{ active_question + 1 }}. {{ question.question }}</p>
          <div class="flex flex-column gap-3">
            <div v-for="option of question.options" :key="option.id" class="flex align-items-center">
              <Checkbox
                v-model="option.checked"
                binary
                :inputId="`option_${option.id}`"
                @change="handleOptionClick(option.checked, question.id, option.id)"
              />
              <label :for="`option_${option.id}`" class="ml-2">{{ option.text }}</label>
            </div>
          </div>
        </div>
        <div class="flex align-items-center gap-3 mt-7">
          <Button
            icon="pi pi-chevron-left"
            class="bg-green-100 text-green-500"
            text
            :disabled="active_question === 0"
            @click="active_question--"
          />
          <Button
            icon="pi pi-chevron-right"
            class="bg-green-100 text-green-500"
            text
            :disabled="active_question === questions.length - 1"
            @click="active_question++"
          />
        </div>
        <div class="flex justify-content-end mt-5">
          <Button
            severity="danger"
            label="Аяқтау"
            text
            class="bg-red-50"
            @click="finishTest"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style lang="scss">
.test__question {
  &_index {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    font-weight: 500;
    opacity: 0.4;
    color: #FFF;
    border-radius: 100%;
    background-color: var(--primary-500);

    &--active {
      opacity: 1;
    }

    &--disabled {
      background-color: #C3C1C1;
    }
  }
}

.current-counter {
  font-size: 2.5rem;
  font-weight: 600;
}
</style>
