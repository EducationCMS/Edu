<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import ProgressBar from "primevue/progressbar"
import { useRouter } from "vue-router"

const router = useRouter()
const courses = ref([])

const getCourseList = async() => {
  try {
    const { data } = await http.get('subject/get-all')
    courses.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

onMounted(() => {
  getCourseList()
})
</script>

<template>
  <h1 class="mb-7">Менің курстарым</h1>
  <div
    v-for="(course, idx) in courses"
    :key="course.id"
    class="flex mb-6"
    style="max-width: 50rem"
  >
    <Avatar
      :label="course.name ? course.name.charAt(0) : '?'"
      class="w-10rem h-10rem text-7xl"
      style="background-color: rgba(3, 193, 125, 0.86); color: #ffffff"
    />
    <div class="ml-6 flex flex-column flex-1 border-bottom-1">
      <p class="text-2xl font-semibold mt-0">{{ course.name }}</p>
      <div class="mt-auto mb-5 flex align-items-end gap-4">
        <ProgressBar :value="course.percentage || 0" class="flex-1" :show-value="false" style="height: 10px;"/>
        <Button
          icon="pi pi-arrow-right"
          rounded
          @click="router.push({ name: 'CourseDetail', params: { id: course.id } })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
