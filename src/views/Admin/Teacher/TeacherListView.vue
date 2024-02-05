<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue"
import http from "@/plugins/axios"
import axios from "axios"
import Input from "@/components/Form/Input.vue"
import PhoneInput from "@/components/Form/PhoneInput.vue"
import type { IUser } from "@/stores/user"
import TeacherGroupListDialog from "@/components/Admin/TeacherGroupListDialog"
import type { DataTableRowClickEvent } from "primevue/datatable"
import ToggleButton from "primevue/togglebutton"
import Paginator, { type PageState } from "primevue/paginator"
import CreatedUserData from "@/components/Admin/CreatedUserData"

const INITIAL_DATA = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone: '',
  iin: '',
  courses: []
}

const dialog_visible = ref(false)
const search = ref("")
const page = ref(1)
const size = ref(10)
const errors = ref<{ [key: string]: string }>({})
const is_loading = ref(false)
const is_creating = ref(false)
const delay_timer = ref<ReturnType<typeof setTimeout>>()
const teachers = ref([])
const teachersCount = ref(0)
const courses = ref([])
const visible = ref(false)
const teacher_data = reactive({ ...INITIAL_DATA })
const groups = ref([])
const teacher_id = ref(0)
const isCreated = ref(false)
const credentials = reactive({
  login: '',
  password: ''
})

const fetchTeachers = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get("admin/get-teachers", {
      params: {
        page: page.value,
        size: size.value,
        ...(search.value && { query: search.value })
      }
    })
    teachers.value = data?.items || []
    teachersCount.value = data?.totalCount ?? 0
  } catch(err) {
    console.error(err)
    throw err
  }
  is_loading.value = false
}

const fetchCourses = async() => {
  try {
    const { data } = await http.get("admin/subjects")
    courses.value = data || []
  } catch(err) {
    console.error(err)
    throw err
  }
}

watch(() => search.value, () => {
  clearTimeout(delay_timer.value)
  delay_timer.value = setTimeout(() => {
    fetchTeachers()
  }, 300)
})

const createTeacher = async() => {
  is_creating.value = true
  try {
    const { data } = await http.post('admin/registration-teacher', {
      firstName: teacher_data.first_name,
      lastName: teacher_data.last_name,
      ...(teacher_data.middle_name && { middleName: teacher_data.middle_name }),
      phoneNumber: teacher_data.phone,
      email: teacher_data.email,
      subjects: teacher_data.courses,
    })
    Object.assign(teacher_data, INITIAL_DATA)
    credentials.login = data?.login
    credentials.password = data?.password
    isCreated.value = true
    // visible.value = false
    await fetchTeachers()
  } catch(err) {
    if(axios.isAxiosError(err)) {
      // const fieldErrors = err.response?.data?.['fieldErrors'] as IFieldError
      errors.value = err.response?.data?.['fieldErrors'] || {}
    } else {
      console.error(err)
      throw err
    }
  } finally {
    is_creating.value = false
  }
}

const getGroupList = async(id: number) => {
  try {
    const { data } = await http.get(`subgroup/get-by-teacher/${id}`)
    groups.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const editTeacher = (event: DataTableRowClickEvent) => {
  const teacher = event.data
  console.log(teacher)
}

const toggleIsActive = async(event: boolean, user: IUser) => {
  console.log(event)
  try {
    await http.post(`admin/${!event ? 'block' : 'unblock'}-account/${user.id}`)
    user.isActive = event
  } catch(e) {
    console.error(e)
    throw e
  }
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  fetchTeachers()
}

const openDialog = (data: IUser) => {
  teacher_id.value = data.id
  getGroupList(data.id)
  dialog_visible.value = true
}

const closeDialog = () => {
  groups.value = []
  teacher_id.value = 0
}

onMounted(async() => {
  await fetchTeachers()
  await fetchCourses()
})

</script>

<template>
  <TeacherGroupListDialog
      v-model="dialog_visible"
      :groups="groups"
      :teacher-id="teacher_id"
      @close="closeDialog"
  />
  <Dialog v-model:visible="visible" modal header="Добавление учителя на платформу" :style="{ maxWidth: '700px' }" @after-hide="isCreated = false">
    <div class="formgrid grid">
      <div class="field col-6">
        <Input
            v-model="teacher_data.first_name"
            label="Имя"
            id="first_name"
            :error="errors['firstName']"
        />
      </div>
      <div class="field col-6">
        <Input
            v-model="teacher_data.last_name"
            label="Фамилия"
            id="last_name"
            :error="errors['lastName']"
        />
      </div>
      <div class="field col-6">
        <Input
            v-model="teacher_data.middle_name"
            label="Отчество (необязательно)"
            id="middle_name"
            :error="errors['middleName']"
        />
      </div>
      <div class="field col-12">
        <PhoneInput
            v-model="teacher_data.phone"
            label="Телефон"
            :error="errors['phoneNumber']"
        />
      </div>
      <div class="field col-12">
        <Input
            v-model="teacher_data.email"
            label="E-mail"
            id="email"
            :error="errors['email']"
        />
      </div>
      <div class="field col-12">
        <div class="flex flex-column gap-2">
          <label for="email" class="font-semibold">Предмет</label>
          <MultiSelect
              v-model="teacher_data.courses"
              display="chip"
              :options="courses"
              optionLabel="name"
              option-value="id"
              placeholder="Выберите предметы"
              class="w-full md:w-20rem"
          />
        </div>
      </div>
      <div v-if="credentials.login && credentials.password" class="col-12">
        <CreatedUserData :password="credentials.password" :login="credentials.login" />
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
            v-if="!isCreated"
            label="Сохранить"
            :loading="is_creating"
            @click="createTeacher"
        />
        <Button
            v-else
            label="Закрыть"
            @click="visible = false"
        />
      </div>
    </div>
  </Dialog>
  <div>
    <h1 class="font-semibold">Добавление учителей</h1>
    <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" type="search" />
      </span>
      <Button
          label="+ Добавить учителя"
          @click="visible = true"
      />
    </div>
  </div>
  <div style="max-width: 60rem">
    <DataTable
        :value="teachers"
        :loading="is_loading"
        striped-rows
        show-gridlines
        @row-click="editTeacher"
    >
      <template #empty>
        <p class="text-gray-600 text-center">Учителя не найдены</p>
      </template>
      <Column field="firstName" header="Учитель">
        <template #body="slotProps">
          {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}
        </template>
      </Column>
      <Column field="phoneNumber" header="Номер">
        <template #body="slotProps">
          {{ `+7${slotProps.data.phoneNumber}` }}
        </template>
      </Column>
      <Column field="email" header="E-mail"></Column>
      <Column field="subject" header="Предмет">
        <template #body="slotProps">
          {{ slotProps.data.subjects.map(subject => subject.name).join(", ") }}
        </template>
      </Column>
      <Column field="groups" header="Классы">
        <template #body="slotProps">
          <Button
              size="small"
              class="bg-green-100 text-green-500 font-normal"
              text
              style="height: 30px"
              severity="success"
              @click="openDialog(slotProps.data)"
          >Классы</Button>
        </template>
      </Column>
      <Column header="Активен">
        <template #body="slotProps">
          <ToggleButton
              :model-value="slotProps.data.isActive"
              on-label="Да"
              off-label="Нет"
              @update:model-value="toggleIsActive($event, slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
        v-model="page"
        :rows="size"
        :total-records="teachersCount"
        @page="onPageChange"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
