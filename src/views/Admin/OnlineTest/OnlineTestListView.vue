<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import http from "@/plugins/axios"
import OnlineTestCard from "@/components/Admin/OnlineTest/OnlineTestCard.vue"

const INITIAL_DATA = {
  name: "",
  description: "",
  modules: []
}

const search = ref('')
const courses = ref([])
const visible = ref(false)
const new_module_name = ref('')
const course_data = reactive({ ...INITIAL_DATA })


const getTestList = async() => {
  try {
    const { data } = await http.get("admin/subjects")
    courses.value = data || []
  } catch(err) {
    throw new Error(err)
  }
}

onMounted(() => {
  getTestList()
})
</script>

<template>
  <Dialog
      v-model:visible="visible"
      modal
      header="Добавление нового курса"
      :style="{ width: '70vw' }"
  >
    <div class="formgrid grid">
      <div class="field col-8 mb-5">
        <label for="course_name" class="font-semibold">Название курса</label>
        <InputText id="course_name" class="w-full" v-model="course_data.name" />
      </div>
      <div class="field col-8">
        <label for="course_description" class="font-semibold d">Описание курса</label>
        <InputText id="course_description" class="w-full" v-model="course_data.description" />
      </div>
      <div class="field col-12">
        <p class="font-semibold d">Модули</p>
        <div class="flex ">
          <InputText v-model="new_module_name" placeholder="Название модуля" class="flex-grow-1 mr-2" />
          <Button icon="pi pi-plus" rounded aria-label="Добавить курс" />
        </div>
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
            label="Сохранить"
            @click="createCourse"
        />
      </div>
    </div>
  </Dialog>
  <div>
    <h1 class="font-semibold">Онлайн тесты</h1>
    <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" />
      </span>
      <Button
          label="+ Добавить тест"
          @click="visible = true"
      />
    </div>
  </div>
  <div class="grid gap-4">
    <div class="col-4">
      <OnlineTestCard/>
    </div>
    <div class="col-4">
      <OnlineTestCard/>
    </div>
    <div class="col-4">
      <OnlineTestCard/>
    </div>
    <div class="col-4">
      <OnlineTestCard/>
    </div>
    <div class="col-4">
      <OnlineTestCard/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
