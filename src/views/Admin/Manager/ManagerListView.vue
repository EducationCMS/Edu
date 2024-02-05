<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue"
import http from "@/plugins/axios"
import axios from "axios"
import PhoneInput from "@/components/Form/PhoneInput.vue"
import { useToast } from "primevue/usetoast"
import ToggleButton from "primevue/togglebutton"
import Paginator, { type PageState } from "primevue/paginator"
import type { IUser } from "@/stores/user"
import CreatedUserData from "@/components/Admin/CreatedUserData"
import type { DataTableRowClickEvent } from "primevue/datatable"

const INITIAL_DATA = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone: '',
  iin: ''
}

const toast = useToast()

const search = ref("")
const errors = ref<{ [key: string]: string }>({})
const is_loading = ref(false)
const is_creating = ref(false)
const delay_timer = ref<ReturnType<typeof setTimeout>>()
const managers = ref([])
const managersCount = ref(0)
const visible = ref(false)
const page = ref(1)
const size = ref(10)
const manager_data = reactive({ ...INITIAL_DATA })
const isCreated = ref(false)
const editableItemId = ref(0)
const credentials = reactive({
  login: '',
  password: ''
})

const fetchManagers = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get("admin/get-managers", {
      params: {
        page: page.value,
        size: size.value,
        ...(search.value && { query: search.value })
      }
    })
    managers.value = data?.items || []
    managersCount.value = data?.totalCount ?? 0
  } catch(err) {
    console.error(err)
    throw err
  }
  is_loading.value = false
}

watch(() => search.value, () => {
  clearTimeout(delay_timer.value)
  delay_timer.value = setTimeout(() => {
    fetchManagers()
  }, 300)
})

const createManager = async() => {
  is_creating.value = true
  try {
    const { data } = await http.post('admin/registration-manager', {
      firstName: manager_data.first_name,
      lastName: manager_data.last_name,
      middleName: manager_data.middle_name,
      phoneNumber: manager_data.phone,
      email: manager_data.email,
      // iin: manager_data.iin
    })
    Object.assign(manager_data, INITIAL_DATA)
    toast.add({ severity: 'success', summary: 'Успешно!', detail: 'Менеджер добавлен', life: 3000 });
    credentials.login = data?.login
    credentials.password = data?.password
    isCreated.value = true
    await fetchManagers()
    // visible.value = false
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
  // visible.value = false
}

const onRowClick = (event: DataTableRowClickEvent) => {
  const data = event.data as IUser
  manager_data.iin = data.iin
  manager_data.email = data.email
  manager_data.first_name = data.firstName
  manager_data.last_name = data.lastName
  manager_data.middle_name = data.middleName
  manager_data.phone = data.phoneNumber
  editableItemId.value = data.id
  console.log(editableItemId.value)
  visible.value = true
}

const toggleIsActive = async(event: boolean, user: IUser) => {
  try {
    await http.post(`admin/${!event ? 'block' : 'unblock'}-account/${user.id}`)
    user.isActive = event
  } catch(e) {
    console.error(e)
    throw e
  }
}

const hasKey = (key: string) => {
  return Object.prototype.hasOwnProperty.call(errors.value, key);
};

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  fetchManagers()
}

const onCloseDialog = () => {
  isCreated.value = false
  // Object.assign(manager_data, { ...INITIAL_DATA })
}

onMounted(() => {
  fetchManagers()
})

</script>

<template>
  <Dialog v-model:visible="visible" modal header="Добавление менеджера в платформу" :style="{ width: '50vw' }" @after-hide="onCloseDialog">
    <div class="formgrid grid">
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="first_name" class="font-semibold">Имя</label>
          <InputText
              id="first_name"
              v-model="manager_data.first_name"
              :class="[hasKey('firstName') && 'p-invalid']"
              aria-describedby="first_name_error"
          />
          <small v-if="errors['firstName']" class="p-error" id="first_name_error">{{ errors['firstName'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Фамилия</label>
          <InputText
              id="last_name"
              v-model="manager_data.last_name"
              :class="[hasKey('lastName') && 'p-invalid']"
              aria-describedby="last_name_error"
          />
          <small v-if="errors['lastName']" class="p-error" id="last_name_error">{{ errors['lastName'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="middle_name" class="font-semibold">Отчество (необязательно)</label>
          <InputText id="middle_name" v-model="manager_data.middle_name" />
        </div>
      </div>
      <!--      <div class="field col-6">-->
      <!--        <div class="flex flex-column gap-2">-->
      <!--          <label for="iin" class="font-semibold">ИИН</label>-->
      <!--          <InputText id="iin" v-model="manager_data.iin" />-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="field col-12">
        <div class="flex flex-column gap-2">
          <PhoneInput v-model="manager_data.phone" label="Телефон" :error="errors['phoneNumber']"/>
          <!--          <label for="phone_number" class="font-semibold">Телефон</label>-->
          <!--          <InputText-->
          <!--            id="phone_number"-->
          <!--            v-model="manager_data.phone"-->
          <!--            :class="[hasKey('phoneNumber') && 'p-invalid']"-->
          <!--            aria-describedby="phone_number_error"-->
          <!--          />-->
          <!--          <small v-if="errors['phoneNumber']" class="p-error" id="phone_number_error">{{ errors['phoneNumber'] ?? '&nbsp;'  }}</small>-->
        </div>
      </div>
      <div class="field col-12">
        <div class="flex flex-column gap-2">
          <label for="email" class="font-semibold">E-mail</label>
          <InputText
              id="email"
              v-model="manager_data.email"
              :class="[hasKey('email') && 'p-invalid']"
              aria-describedby="email_error"
          />
          <small v-if="errors['email']" class="p-error" id="email_error">{{ errors['email'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div v-if="isCreated" class="col-12">
        <CreatedUserData :password="credentials.password" :login="credentials.login" />
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
            v-if="!isCreated"
            label="Сохранить"
            :loading="is_creating"
            @click="createManager"
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
    <h1 class="font-semibold">Добавление менеджеров</h1>
    <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" type="search" />
      </span>
      <Button
          label="+ Добавить менеджера"
          @click="visible = true"
      />
    </div>
  </div>
  <div style="max-width: 50rem">
    <DataTable
        :value="managers"
        :loading="is_loading"
        striped-rows
        show-gridlines
    >
      <!--      @row-click="onRowClick"-->
      <template #empty>
        <p class="text-gray-600 text-center">Менеджеры не найдены</p>
      </template>
      <Column field="firstName" header="Менеджер">
        <template #body="slotProps">
          {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}
        </template>
      </Column>
      <Column field="phoneNumber" header="Номер">
        <template #body="slotProps">
          +7{{ slotProps.data.phoneNumber }}
        </template>
      </Column>
      <Column field="email" header="E-mail"></Column>
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
        :total-records="managersCount"
        @page="onPageChange"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
