<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"

const tests = ref([])

const getTestList = async() => {
  try {
    const { data } = await http.get('admin/app-tests')
    console.log(data)
  } catch(e) {
    console.error(e)
    throw e
  }
}

onMounted(() => {
  getTestList()
})
</script>

<template>
  <h1 class="font-semibold">Добавить тест</h1>
  <div>

  </div>
</template>

<style scoped lang="scss">

</style>
