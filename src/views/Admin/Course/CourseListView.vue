<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import http from "@/plugins/axios"
import type { IUser } from "@/stores/user"
import type { DataTableRowClickEvent } from "primevue/datatable"
import router from "@/router"
import Textarea from "primevue/textarea"
import { VueDraggableNext as draggable } from "vue-draggable-next"

export interface ITest {
  id: number,
  name: string,
  deadline: string,
  status: string
}

export interface ITask {
  id: number,
  name: string,
  description: string,
  deadline: string,
  status: string
}
export interface ITopic {
  id: number,
  appTest: ITest,
  name: string,
  task: ITask,
  description: string,
  orderPosition: number,
}

export interface IModule {
  id?: number,
  name: string,
  orderPosition: number,
  topics: ITopic[]
}

export interface ICourse {
  id?: number,
  name: string,
  createdDate?: string,
  modules: IModule[],
  teacher?: IUser,
  contextType: string
}

interface ICourseModuleError {
  name: string,
  topics?: ICourseItemError
}

interface ICourseItemError {
  [key: number]: ICourseModuleError
}

interface ICourseError {
  modules?: ICourseItemError
}


const TOPIC_BODY = {
  name: '',
  description: ''
}

const MODULE_BODY = {
  name: '',
  topics: [{ ...TOPIC_BODY }]
}

const INITIAL_DATA = {
  name: "",
  description: "",
  contextType: 'NO_CONTEXT',
  modules: [{ ...MODULE_BODY }],
}

const errors = ref<ICourseError>()
const courses = ref([])
const visible = ref(false)
const is_edit = ref(false)
const is_loading = ref(false)
const is_creating = ref(false)
const course_data = reactive<ICourse>(structuredClone(INITIAL_DATA))
const contexts = ref([
  { name: 'Full context', value: 'FULL_CONTEXT' },
  { name: 'Half context', value: 'HALF_CONTEXT' },
  { name: 'Third context', value: 'THIRD_CONTEXT' },
  { name: 'No context', value: 'NO_CONTEXT' }
])

const createCourse = async () => {
  is_creating.value = true
  try {
    const url = 'admin/subjects'
    const payload = {
      ...(course_data.id && ({ id: course_data.id })),
      name: course_data.name,
      contextType: course_data.contextType,
      modules: course_data.modules.map((module, idx) => ({
        ...module,
        topics: module.topics.map((topic, tIdx) => ({ ...topic, orderPosition: tIdx })),
        orderPosition: idx
      }))
    }
    if(is_edit.value) await http.put(url, payload)
    else await http.post(url, payload)
    visible.value = false
    await getCourseList()
  } catch(err) {
    console.error(err)
    errors.value = err.response.data?.fieldErrors ?? {}
    throw err
  } finally {
    is_creating.value = false
  }
}

const getCourseList = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get("admin/subjects")
    courses.value = (data ?? []).map((subject: ICourse) => {
      return {
        ...subject,
        topicsCount: (subject.modules ?? []).reduce((acc, module) => module.topics.length + acc, 0)
      }
    })
  } catch(err) {
    console.error(err)
    throw err
  } finally {
    is_loading.value = false
  }
}

// const changeModuleOrder = async(module: IModule, orderPosition: number) => {
//   try {
//     const { data } = await http.put('admin/modules/' + module.id, {
//       ...module,
//       orderPosition
//     })
//     console.log(data)
//   } catch(err) {
//     console.error(err)
//     throw err
//   }
// }

const toCoursePage = (row: DataTableRowClickEvent) => {
  const course_id = row.data?.id
  router.push({ name: 'AdminCourseDetail', params: { id: course_id } })
}

const openEditDialog = (data: ICourse) => {
  course_data.id = data?.id
  course_data.name = data?.name
  course_data.contextType = data?.contextType
  course_data.modules =  data?.modules.length === 0 ? [structuredClone(MODULE_BODY)] : data?.modules
  visible.value = true
  is_edit.value = true
}

const onDialogClose = () => {
  errors.value = {}
  Object.assign(course_data, structuredClone(INITIAL_DATA))
  is_edit.value = false
}

const addEmptyModule = () => {
  course_data.modules = [...course_data.modules, { ...MODULE_BODY, topics: [{ ...TOPIC_BODY }] }]
}

const addEmptyTopic = (id: number) => {
  course_data.modules[id].topics = [...course_data.modules[id].topics, { ...TOPIC_BODY }]
}

const removeModule = (id: number) => {
  course_data.modules = course_data.modules.filter((module, index) => index !== id)
}

const removeTopic = (module_id: number, topic_id: number) => {
  course_data.modules[module_id].topics = course_data.modules[module_id].topics.filter((topic, index) => index !== topic_id)
}

const hasModuleError = (mIdx: number) => {
  return !!errors.value?.modules?.[mIdx].name
}

const hasTopicError = (mIdx: number, tIdx: number) => {
  return !!errors.value?.modules?.[mIdx]?.topics?.[tIdx].name
}

// const onDragChange = (event: any) => {
//   console.log(course_data.modules)
//   const { newIndex, oldIndex } = event.moved
//   course_data.modules.map(module => {
//     if(module.orderPosition === oldIndex) return { ...module, orderPosition: newIndex }
//     else if(module.orderPosition === newIndex) return { ...module, orderPosition: oldIndex }
//     else return module
//   })
//
//   console.log(course_data.modules)
// }

onMounted(getCourseList)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Добавить новый курс"
    :style="{ width: '70vw' }"
    @after-hide="onDialogClose"
  >
    <div class="formgrid grid">
      <div class="field col-8">
        <label for="course_name" class="font-semibold">Название курса</label>
        <InputText id="course_name" class="w-full" v-model="course_data.name" />
      </div>
      <div class="field col-4">
        <label for="course_name" class="font-semibold">Контекст</label>
        <Dropdown
          v-model="course_data.contextType"
          class="w-full border-round-lg"
          :options="contexts"
          option-value="value"
          option-label="name"
        />
      </div>
<!--      <div class="field col-8">-->
<!--        <label for="course_description" class="font-semibold d">Курс сипаттамасы</label>-->
<!--        <InputText id="course_description" class="w-full" v-model="course_data.description" />-->
<!--      </div>-->
      <div class="field col-12">
        <div class="flex align-items-center justify-content-between surface-100 border-round-2xl px-3 py-2">
          <span class="font-semibold">Модули</span>
          <Button icon="pi pi-plus" class="ml-4 is-40x40" rounded aria-label="Добавить курс" size="small" @click="addEmptyModule"/>
        </div>
        <draggable v-model="course_data.modules" :animation="200">
          <Panel v-for="(module, mIdx) in course_data.modules" :key="`module-${mIdx}`" class="mt-3" toggleable :collapsed="is_edit">
            <template #header>
              <InputText v-model="module.name" placeholder="Название модуля" class="p-inputtext-sm w-30rem" :class="[hasModuleError(mIdx) && 'p-invalid']" />
            </template>
            <template #icons>
              <button class="p-panel-header-icon p-link mr-2" @click="removeModule(mIdx)">
                <span class="pi pi-trash"></span>
              </button>
            </template>
            <div>
              <div class="flex align-items-center justify-content-between">
                <p class="font-semibold">Темы</p>
                <Button label="Қосу" class="ml-4 h-2rem" aria-label="Добавить курс" size="small" @click="addEmptyTopic(mIdx)"/>
              </div>
              <draggable v-model="module.topics" :animation="200">
                <div
                  v-for="(topic, tIdx) in module.topics"
                  :key="`module-${mIdx}-topic-${tIdx}`"
                  class="surface-100 p-2 border-round mt-2 flex justify-content-between align-items-center"
                >
                  <div class="flex flex-column gap-2 w-30rem">
                    <InputText
                      v-model="topic.name"
                      placeholder="Название темы"
                      class="p-inputtext-sm flex-1"
                      :class="[hasTopicError(mIdx, tIdx) && 'p-invalid']"
                      @keyup.enter="addEmptyTopic(mIdx)"
                    />
                    <Textarea v-model="topic.description" placeholder="Описание темы" class="p-inputtext-sm flex-1" rows="4"/>
                  </div>
                  <button class="p-panel-header-icon p-link mr-2" @click="removeTopic(mIdx, tIdx)">
                    <span class="pi pi-trash"></span>
                  </button>
                </div>
              </draggable>
            </div>
          </Panel>
        </draggable>
<!--        <div class="p-3 surface-100 mt-3">-->
<!--          <div class="flex">-->
<!--            <InputText v-model="new_module_name" placeholder="Модуль атауы" class="flex-grow-1" />-->
<!--          </div>-->
<!--          <div class="mx-4">-->
<!--            <div class="flex align-items-center justify-content-between mt-2">-->
<!--              <p class="font-semibold">Тақырыптары</p>-->
<!--              <Button icon="pi pi-plus" class="ml-4 is-40x40" rounded aria-label="Курсты қосу" size="small" />-->
<!--            </div>-->
<!--            <InputText v-model="new_module_name" placeholder="Тақырып атауы" class="flex-grow-1 p-inputtext-sm" />-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
          label="Сохранить"
          :loading="is_creating"
          :disabled="!course_data.name"
          @click="createCourse"
        />
      </div>
    </div>
  </Dialog>
  <div class="flex align-items-center justify-content-between">
    <h1 class="font-semibold">Курсы</h1>
    <div class="flex justify-content-end align-items-center">
      <Button
        label="+ Добавить новый курс"
        @click="visible = true"
      />
    </div>
  </div>
  <div style="max-width: 60rem">
    <p class="font-semibold text-xl">Все курсы</p>
    <DataTable
      :value="courses"
      :loading="is_loading"
      striped-rows
      table-class="border-solid border-1 border-300"
      @row-click="toCoursePage"
    >
      <template #empty>
        <p class="text-gray-600 text-center">Курсы не найдены</p>
      </template>
      <Column field="name" header="Название курса"/>
      <Column field="createdDate" header="Дата">
<!--        <template #body="slotProps">-->
<!--          {{ onlyDateFormatter(slotProps.data.createdDate) }}-->
<!--        </template>-->
      </Column>
      <Column field="modules.length" header="Модуль">
        <template #body="slotProps">
          {{ slotProps.data.modules.length }}
        </template>
      </Column>
      <Column field="topicsCount" header="Темы">
<!--        <template #body="slotProps">-->
<!--          {{ slotProps.data.modules.length ? slotProps.data.modules.topics?.length : 0 }}-->
<!--        </template>-->
      </Column>
      <Column field="options" header="">
        <template #body="slotProps">
          <Button
            size="small"
            class="bg-green-100 text-green-500"
            text
            label="Изменить"
            style="height: 36px;"
            severity="success"
            @click="openEditDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">

</style>
