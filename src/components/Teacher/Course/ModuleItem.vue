<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"

const props = defineProps({
  buttonLabel: String,
  buttonDisabled: Boolean,
  taskId: [String, Number],
  testId: [String, Number],
  title: String,
  deadline: String,
  description: String,
  isTopic: {
    type: Boolean,
    default: true
  },
  isTeacher: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'action'): void,
  (e: 'deadlineChange'): void
}>()

const router = useRouter()
const route = useRoute()

const group_id = ref()
const course_id = ref()
const itemDeadline = ref(props.deadline)
const editDeadline = ref(false)

const updateTestDeadline = async() => {
  const date = new Date(itemDeadline.value).toLocaleDateString()
  const time = new Date(itemDeadline.value).toLocaleTimeString()
  const dateTime = `${date} ${time}`

  try {
    const { data } = await http.put('app-test/deadline', {
      appTestId: props.testId,
      subgroupId: group_id.value,
      deadline: dateTime
    })
    console.log(data)
    emits('deadlineChange')
    editDeadline.value = false
  } catch(err) {
    console.error(err)
    throw err
  }
}

const updateTaskDeadline = async() => {
  const date = new Date(itemDeadline.value).toLocaleDateString()
  const time = new Date(itemDeadline.value).toLocaleTimeString()
  const dateTime = `${date} ${time}`

  try {
    const { data } = await http.put('task/deadline', {
      taskId: props.taskId,
      subgroupId: group_id.value,
      deadline: dateTime
    })
    console.log(data)
    emits('deadlineChange')
    editDeadline.value = false
  } catch(err) {
    console.error(err)
    throw err
  }
}

const onEditDeadlineButtonClick = () => {
  if(editDeadline.value) {
    if(props.testId) updateTestDeadline()
    else if(props.taskId) updateTaskDeadline()
  } else {
    editDeadline.value = !editDeadline.value
  }
}


onMounted(() => {
  group_id.value = route.params?.group_id
  course_id.value = route.params?.course_id
})
</script>

<template>
  <div class="flex gap-3 mt-4" style="min-height: 80px">
    <div class="flex flex-column align-items-center">
      <div
        class="module-item__icon module-item__icon--success flex align-items-center justify-content-center mb-2"
        :class="[!isTopic && 'module-item__icon--error']"
      >
        <i
          :class="['pi', 'text-xs font-bold', isTopic ? 'pi-check' : 'pi-bookmark']"
        ></i>
      </div>

      <div class="module-item__line flex-1"></div>
    </div>
    <div class="py-1 flex-1">
      <p class="my-0 text-lg">{{ title }}</p>
      <p class="text-600 font-light text-sm is-ellipsis" :title="description">{{ description }}</p>
      <template v-if="isTeacher">
        <div class="mt-4">
          <p class="text-600 font-light text-sm">Дедлайн</p>
          <div class="flex gap-2 align-items-center">
            <i class="pi pi-calendar"></i>
            <Calendar v-if="editDeadline" id="calendar-24h" v-model="itemDeadline" showTime hourFormat="24" dateFormat="dd/mm/yy" />
            <p v-else class="font-semibold text-700"> {{ deadline ?? 'қойылмаған' }}</p>
            <Button :icon="!editDeadline ? 'pi pi-pencil' : 'pi pi-check'" text size="small" @click="onEditDeadlineButtonClick" />
          </div>
<!--          <p class="font-semibold text-700"><i class="pi pi-calendar"></i> {{ deadline }}</p>-->
        </div>
      </template>
      <template v-else>
        <div v-if="deadline" class="mt-4">
          <p class="text-600 font-light text-sm">Дедлайн</p>
          <p class="font-semibold text-700"><i class="pi pi-calendar"></i> {{ deadline }}</p>
        </div>
      </template>
      <div class="flex justify-content-end">
        <Button
          :label="buttonLabel"
          size="small"
          class="border-round-xl"
          outlined
          :disabled="buttonDisabled"
          @click="emits('action')"
        />
<!--        <Button-->
<!--          v-else-->
<!--          label="Ашу"-->
<!--          size="small"-->
<!--          class="border-round-xl"-->
<!--          outlined-->
<!--          @click="router.push({ name: 'TeacherGroupCourseTaskDetail', params: { group_id: group_id, course_id: course_id, task_id: taskId  } })"-->
<!--        />-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.module-item {
  &__icon {
    color: #B3B3B3;
    border-radius: 100%;
    width: 24px;
    height: 24px;
    border: 2px solid #B3B3B3;

    &--success {
      color: rgba(3, 193, 125, 1);
      border: 2px solid rgba(3, 193, 125, 1);
    }
    &--error {
      color: #FC0505;
      border: 2px solid #FC0505;
    }
  }
  &__line {
    height: 100%;
    width: 1px;
    background-color: rgba(204, 204, 204, 1);
  }
}

.is-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
