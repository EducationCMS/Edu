<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import http from "@/plugins/axios"
import axios from "@/plugins/axios"
import type { IDictionaryItemName } from "@/views/Manager/StudentListView.vue"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import type { PageState } from "primevue/paginator"
import Paginator from "primevue/paginator"

const delay_timer = ref<ReturnType<typeof setTimeout>>()
const search = ref('')
const page = ref(1)
const size = ref(10)
const is_loading = ref(false)
const students = ref([])
const studentsCount = ref(0)
const cities = ref([])
const regions = ref([])
const groups = ref([])
const selected_region = ref(null)
const selected_city = ref(null)
const selected_group = ref(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

watch(() => search.value, () => {
  clearTimeout(delay_timer.value)
  delay_timer.value = setTimeout(() => {
    getStudentList()
  }, 300)
})

const getDictionaryItem = async(name: IDictionaryItemName) => {
  try {
    const { data } = await axios.get(`dictionary/${name}`)
    return data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getDictionaryItemList = async() => {
  cities.value    = await getDictionaryItem('cities')
  regions.value   = await getDictionaryItem('regions')
  groups.value    = await getDictionaryItem('groups')
}

const getStudentList = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get('get-students', {
      params: {
        page: page.value,
        size: size.value,
        managerId: user.value?.id,
        ...(!!search.value && { query: search.value }),
        ...(selected_group.value ? { groupId: selected_group.value } : {}),
        ...(selected_city.value ? { cityId: selected_city.value } : {}),
        ...(selected_region.value ? { regionId: selected_region.value } : {}),
      }
    })
    students.value = data?.items || []
    studentsCount.value = data?.totalCount ?? 0
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_loading.value = false
  }
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  getStudentList()
}

onMounted(() => {
  getStudentList()
  getDictionaryItemList()
})
</script>

<template>
  <div>
    <h1 class="font-semibold">Мои студенты</h1>
    <div class="mt-5 mb-4">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" type="search" />
      </span>
    </div>
    <div class="flex align-items-center gap-4 mb-4">
      <Dropdown
          v-model="selected_city"
          placeholder="Город, район, село"
          :options="cities"
          option-label="name"
          option-value="id"
          show-clear
          :disabled="cities.length === 0"
      />
      <Dropdown
          v-model="selected_region"
          placeholder="Область"
          :options="regions"
          option-label="name"
          option-value="id"
          show-clear
          :disabled="regions.length === 0"
      />
      <Dropdown
          v-model="selected_group"
          placeholder="Группа"
          :options="groups"
          option-label="name"
          option-value="id"
          show-clear
          :disabled="groups.length === 0"
      />
      <Button
          label="Поиск"
          @click="getStudentList"
      />
    </div>
    <div >
      <DataTable
          :value="students"
          :loading="is_loading"
          striped-rows
          table-class="border-1 border-solid border-300"
      >
        <template #empty>{{ is_loading ? 'Поиск...' : 'Студенты не найдены' }}</template>
        <Column field="firstName" header="Имя и фамилия">
          <template #body="slotProps">
            {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}
          </template>
        </Column>
        <Column field="city" header="Город, область">
          <template #body="slotProps">
            {{ slotProps.data.city?.name || '-' }}, {{ slotProps.data.city?.region?.name || '-' }}
          </template>
        </Column>
        <Column field="city" header="Группа">
          <template #body="">
            {{ '-' }}
          </template>
        </Column>
        <!--        <Column field="phoneNumber" header="Город, область"></Column>-->
        <!--        <Column field="email" header="Группа"></Column>-->
        <Column field="subject" header="Менеджер"></Column>
        <Column field="groups" header="Полный просмотр">
          <template #body="">
            <Button
                size="small"
                class="bg-green-100 text-green-500"
                text
                icon="pi pi-eye"
                label="Полный просмотр"
                style="height: 36px"
                severity="success"
            />
          </template>
        </Column>
      </DataTable>
      <Paginator
          v-model="page"
          :rows="size"
          :total-records="studentsCount"
          @page="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
