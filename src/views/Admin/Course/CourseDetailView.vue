<script setup lang="ts">
import http from "@/plugins/axios"
import { computed, onMounted, reactive, ref, watch } from "vue"
import type { ICourse, IModule } from "@/views/Admin/Course/CourseListView.vue"
import CreateTestDialog from "@/components/Admin/CreateTestDialog.vue"
import CreateTaskDialog from "@/components/Admin/CreateTaskDialog.vue"

const props = defineProps(['id'])
interface ISubject {
  name: string,
  modules: IModule[]
}
const subject = reactive<ISubject>({
  name: '',
  modules: [],
})
const opened_topic = reactive({
  test_id: null,
  task_id: null,
  name: '',
  id: null,
})
const active_module = ref(0)
const test_dialog_visible = ref(false)
const task_dialog_visible = ref(false)

const getSubject = async() => {
  try {
    const { data } = await http.get(`admin/subjects/${props.id}`)
    subject.name = data?.name
    subject.modules = data?.modules ?? []
    active_module.value = data?.modules?.[0]?.id ?? 0
  } catch(e) {
    console.error(e)
    throw e
  }
}

const topics = computed(() => {
  return subject.modules.find(module => module.id === active_module.value)?.topics ?? []
})

const openDialog = (data: object, open_test = false) => {
  opened_topic.test_id = data?.appTest?.id
  opened_topic.test_id = data?.task?.id
  opened_topic.name = data?.name
  opened_topic.id = data?.id
  if(open_test) test_dialog_visible.value = true
  else task_dialog_visible.value = true
}

const openTestDialog = (data: object) => {
  opened_topic.test_id = data?.appTest?.id
  opened_topic.name = data?.name
  test_dialog_visible.value = true
}

const openTaskDialog = (data: object) => {
  opened_topic.task_id = data?.task?.id
  opened_topic.name = data?.name
  opened_topic.id = data?.id
  task_dialog_visible.value = true
}

watch(test_dialog_visible, (newValue) => {
  if(!newValue) {
    opened_topic.name = ''
    opened_topic.test_id = null
  }
})
watch(task_dialog_visible, (newValue) => {
  if(!newValue) {
    opened_topic.task_id = null
    opened_topic.name = ''
    opened_topic.id = null
  }
})
onMounted(() => {
  getSubject()
})
</script>

<template>
  <CreateTestDialog
    v-model="test_dialog_visible"
    :test-id="opened_topic.test_id"
    :topic-name="opened_topic.name"
    @close="test_dialog_visible = false"
  />
  <CreateTaskDialog
    v-model="task_dialog_visible"
    :task-id="opened_topic.task_id"
    :topic-id="opened_topic.id"
    :topic-name="opened_topic.name"
    @close="task_dialog_visible = false"
  />
  <h2>
    <router-link :to="{ name: 'AdminCourseList' }" class="text-700">Все курсы</router-link>
    <span v-if="subject.name">{{ ` > ${subject.name}` }}</span>
  </h2>
  <div class="mt-6 mb-7">
    <div v-if="subject.modules.length > 0" class="bg-primary-50 border-2 border-primary border-round p-1 w-fit">
      <Button
        v-for="module in subject.modules"
        :key="module.id"
        :label="module.name"
        style="min-width: 12rem"
        size="small"
        :text="active_module !== module.id"
        @click="active_module = module.id"
      />
    </div>
  </div>
  <div style="max-width: 50rem">
    <DataTable
      :value="topics"
      striped-rows
      table-class="border-solid border-1 border-300"
    >
      <template #empty>
        <p class="text-gray-600 text-center">Курс не найден</p>
      </template>
      <Column field="name" header="Название темы"/>
      <Column field="options" header="Тест">
        <template #body="slotProps">
          <Button
            size="small"
            class="bg-green-100 text-green-500"
            text
            label="Изменить"
            style="height: 36px"
            severity="success"
            @click="openTestDialog(slotProps.data)"
          />
        </template>
      </Column>
      <Column field="options" header="Задание" align-header="right">
        <template #body="slotProps">
          <Button
            size="small"
            class="bg-green-100 text-green-500"
            text
            :label="slotProps.data.task ? 'Изменить' : 'Создать'"
            style="height: 36px"
            severity="success"
            @click="openTaskDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">

</style>
