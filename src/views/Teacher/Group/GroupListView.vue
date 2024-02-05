<script setup lang="ts">
import GroupList from "@/components/Teacher/GroupList.vue"
import { ref, watch } from "vue"
import http from "@/plugins/axios"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import ProgressSpinner from "primevue/progressspinner"
import type { ICourse } from "@/views/Admin/Course/CourseListView.vue"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const selected_subject = ref()
const is_loading = ref(false)
const groups = ref([])
const subjects = ref<ICourse[]>()

const getGroupList = async() => {
  is_loading.value = true
  const teacher_id = user.value?.id
  try {
    const { data } = await http.get(`subgroup/get-by-teacher-subject`, {
      params: {
        teacherId: teacher_id,
        subjectId: selected_subject.value
      }
    })
    groups.value = data ?? []
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_loading.value = false
  }
}

watch(() => user.value, (user) => {
  if(user) {
    subjects.value = user.subjects ?? []
    selected_subject.value = subjects.value?.[0]?.id
    getGroupList()
  }
}, { immediate: true })
</script>

<template>
  <h1 class="font-semibold">Сыныптар</h1>
  <Dropdown
    v-model="selected_subject"
    :options="subjects ?? []"
    option-label="name"
    option-value="id"
    placeholder="Группа таңдау"
  />
  <div class="mt-5">
    <div v-if="is_loading" class="flex justify-content-center">
      <ProgressSpinner/>
    </div>
    <GroupList
      v-else
      :course-id="selected_subject"
      :groups="groups"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
