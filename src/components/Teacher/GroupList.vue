<script setup lang="ts">
import { useRouter } from "vue-router"

const props = defineProps({
  groups: Array,
  courseId: [String, Number]
})
const router = useRouter()
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <template v-if="groups.length === 0">
      <p class="font-medium text-center text-lg">Сіздің сыныптарыңыз жоқ</p>
    </template>
    <div
      v-for="group in groups"
      :key="group.id"
      class="group-card cursor-pointer border-1 border-400 surface-100 flex flex-column align-items-center justify-content-center"
      @click="router.push({ name: 'TeacherGroupCourseDetail', params: { group_id: group.id, course_id: courseId } })"
    >
      <Avatar :label="group.name[0].toUpperCase()" size="xlarge" style="background-color:#4caf4f; color: #ffffff" />
      <p class="font-medium mb-0">{{ group.name }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.group-card {
  min-height: 200px;
  flex: 0 1 280px;
}
</style>
