<script setup lang="ts">
import http from "@/plugins/axios"
import { onMounted, ref } from "vue"
import ProgressBar from "primevue/progressbar"
import ModulePanel from "@/components/Teacher/Course/ModulePanel.vue"

const props = defineProps(['group_id', 'course_id'])

const course_name = ref('')
const group_name = ref('')
const modules = ref([])
const attendance = ref(0)

const getCourse = async() => {
  try {
    const { data } = await http.get('subject/get-one-with-teacher', {
      params: {
        subgroupId: props.group_id,
        subjectId: props.course_id
      }
    })
    course_name.value = data?.name ?? ''
    group_name.value = data?.subgroupName ?? ''
    modules.value = data?.modules ?? []
    attendance.value = data?.percentage ?? 0
  } catch(e) {
    console.error(e)
    throw e
  }
}

onMounted(() => {
  getCourse()
})
</script>

<template>
  <h1>
    <router-link :to="{ name: 'TeacherGroupList' }">Менің сыныптарым</router-link>
    <span>{{ ` > ${group_name}` }}</span>
  </h1>
  <div class="flex align-items-center my-6" style="max-width: 50rem">
    <Avatar
      :label="course_name ? course_name.charAt(0) : '?'"
      class="w-10rem h-10rem text-7xl"
      style="background-color: rgba(3, 193, 125, 0.86); color: #ffffff"
    />
    <div class="ml-5 flex-1">
      <h2 class="mt-0">{{ course_name }}</h2>
      <div class="flex align-items-center">
        <ProgressBar :value="attendance" class="flex-1" :show-value="false" style="height: 10px;"/>
        <span class="ml-4 text-xl text-green-500 font-semibold">{{ attendance }}%</span>
      </div>
    </div>
  </div>
  <div class="grid mb-8">
    <div class="col-8">
      <ModulePanel
        v-for="module in modules"
        :key="module.id"
        :module-name="module.name"
        :module-percentage="module.percentage"
        :module-topics="module.topics ?? []"
        @update="getCourse"
      />
    </div>
  </div>
</template>

<style lang="scss">
.p-progressbar .p-progressbar-value {
  background: rgba(3, 193, 125, 0.86);
}
</style>
