<script setup lang="ts">
import GroupList from "@/components/Teacher/GroupList.vue"
import { ref, watch } from "vue"
import http from "@/plugins/axios"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const groups = ref([])

const getGroupList = async() => {
  const teacher_id = user.value?.id
  try {
    const { data } = await http.get(`subgroup/get-by-teacher/${teacher_id}`)
    groups.value = data ?? []
  } catch(e) {
    console.error(e)
    throw e
  }
}

watch(() => user.value, (user) => {
  if(user) getGroupList()
}, { immediate: true })
</script>

<template>
  <h1 class="font-semibold">Бағалар</h1>
  <div class="ml-4">
    <p class="text-lg mb-5">Сіздің сыныптарыңыз</p>
    <GroupList
      :groups="groups"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
