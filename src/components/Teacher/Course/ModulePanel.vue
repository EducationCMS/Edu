<script setup lang="ts">
import ProgressBar from "primevue/progressbar"
import { computed, onMounted, ref } from "vue"
import ModuleItem from "@/components/Teacher/Course/ModuleItem.vue"
import type { ITask, ITest, ITopic } from "@/views/Admin/Course/CourseListView.vue"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import TaskDialog from "@/components/Student/TaskDialog"
import TestDialog from "@/components/Student/TestDialog"
import { useRoute, useRouter } from "vue-router"

interface IProps {
  moduleName: string,
  modulePercentage: number,
  moduleTopics: ITopic[]
}

const props = defineProps<IProps>()
const emits = defineEmits<{
  (e: 'update'): void
}>()
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const role = computed(() => user.value?.appRole?.name)

const is_open = ref(false)
const is_task_edit = ref(false)
const opened_task = ref(0)
const opened_test = ref(0)
const opened_test_status = ref('')
const taskDialogVisible = ref(false)
const testDialogVisible = ref(false)

const group_id = ref()
const course_id = ref()

onMounted(() => {
  group_id.value = route.params?.group_id
  course_id.value = route.params?.course_id
})

const openTaskDialog = (task: ITask) => {
  taskDialogVisible.value = true
  opened_task.value = task.id
  is_task_edit.value = task.status === 'ANSWERED'
}

const closeTaskDialog = () => {
  taskDialogVisible.value = false
  opened_task.value = 0
  is_task_edit.value = false
}

const openTestDialog = (test: ITest) => {
  testDialogVisible.value = true
  opened_test.value = test.id
  opened_test_status.value = test.status
  console.log(test.status)
}

const closeTestDialog = () => {
  testDialogVisible.value = false
  opened_test.value = 0
}

const getButtonLabel = (status?: string) => {
  if(!status) return 'Орындау'
  return {
    'ANSWERED': 'Өзгерту',
    'CHECKED': 'Бағасын көру'
  }[status] || 'Орындау'
}
</script>

<template>
  <TaskDialog
    v-model="taskDialogVisible"
    :task-id="opened_task"
    :is-edit="is_task_edit"
    @close="closeTaskDialog"
  />
  <TestDialog
    v-model="testDialogVisible"
    :test-id="opened_test"
    :is-finished="opened_test_status === 'PASSED'"
    @close="closeTestDialog"
    @refresh="emits('update')"
  />
  <div class="module-panel cursor-pointer mt-5 p-4" @click="is_open = !is_open">
    <div class="flex justify-content-between align-items-center">
      <span class="text-green-500 text-xl font-medium">{{ moduleName }}</span>
      <i class="pi pi-chevron-up text-xl module-panel__icon" :class="[is_open && 'module-panel__icon--opened']"></i>
    </div>
    <div class="flex align-items-end mt-4">
      <ProgressBar :value="modulePercentage" class="flex-1" :show-value="false" style="height: 10px;"/>
      <span class="ml-4 text-xl text-green-500 font-semibold">{{ modulePercentage }}%</span>
    </div>
  </div>
  <div v-if="is_open" class="px-2">
    <div v-for="topic in moduleTopics" :key="topic.id" >
      <ModuleItem
        button-label="Бастау"
        :title="topic.name"
        :description="topic.description"
      />
      <template v-if="role === 'ROLE_STUDENT'">
        <div v-if="topic.appTest" style="margin-left: 2.5rem">
          <ModuleItem
            :title="topic.appTest.name ?? 'Тест'"
            :button-label="topic.appTest.status === 'PASSED' ? 'Көру' : 'Ашу'"
            :is-topic="false"
            :deadline="topic.appTest.deadline"
            @action="openTestDialog(topic.appTest)"
            @closed="emits('update')"
          />
        </div>
        <div v-if="topic.task" style="margin-left: 2.5rem">
          <ModuleItem
            :title="topic.task.name ?? 'Тапсырма'"
            :description="topic.task.description"
            :button-label="getButtonLabel(topic.task.status)"
            :is-topic="false"
            :deadline="topic.task.deadline"
            :status="topic.task.status"
            :button-disabled="topic.task.status === 'CLOSED'"
            @action="openTaskDialog(topic.task)"
          />
        </div>
      </template>
      <template v-else-if="role === 'ROLE_TEACHER'">
        <div v-if="topic.appTest" style="margin-left: 2.5rem">
          <ModuleItem
            :title="topic.appTest.name ?? 'Тест'"
            button-label="Ашу"
            :deadline="topic.appTest.deadline"
            :is-topic="false"
            :test-id="topic.appTest.id"
            is-teacher
            @action="openTestDialog(topic.appTest)"
            @deadline-change="emits('update')"
          />
        </div>
        <div v-if="topic.task" style="margin-left: 2.5rem">
          <ModuleItem
            :title="topic.task.name ?? 'Тапсырма'"
            :description="topic.task.description"
            button-label="Ашу"
            :deadline="topic.task.deadline"
            :is-topic="false"
            :task-id="topic.task.id"
            is-teacher
            @action="router.push({ name: 'TeacherGroupCourseTaskDetail', params: { group_id: group_id, course_id: course_id, task_id: topic.task.id } })"
            @deadline-change="emits('update')"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.module-panel {
  background-color: #FAFAFA;

  &__icon {
    transition: all .4s ease;

    &--opened {
      transform: rotate(-180deg);
    }
  }
}
</style>
