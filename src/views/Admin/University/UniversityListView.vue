<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import http from "@/plugins/axios"
import UniversityCreateDialog from "@/components/Admin/University/UniversityCreateDialog"
import type { DataTableRowClickEvent } from "primevue/datatable"
import Paginator, { type PageState } from "primevue/paginator"

const isLoading = ref(false)
const search = ref('')
const page = ref(1)
const size = ref(10)
const delayTimer = ref<ReturnType<typeof setTimeout>>()
const universities = ref([])
const universitiesCount = ref(0)
const dialogIsVisible = ref(false)
const editableItem = ref()

watch(() => search.value, () => {
  clearTimeout(delayTimer.value)
  delayTimer.value = setTimeout(() => {
    getUniversities()
  }, 300)
})

const getUniversities = async() => {
  isLoading.value = true
  try {
    const { data } = await http.get('admin/universities', {
      params: {
        page: page.value,
        size: size.value,
        ...(search.value && { query: search.value })
      }
    })
    universities.value = data?.items ?? []
    universitiesCount.value = data?.totalCount ?? []
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  getUniversities()
}

const editItem = (item: DataTableRowClickEvent) => {
  editableItem.value = item.data
  dialogIsVisible.value = true
}

const onCloseDialog = () => {
  dialogIsVisible.value = false
  editableItem.value = undefined
  getUniversities()
}

onMounted(getUniversities)
</script>

<template>
  <h1 class="font-semibold">Добавление университета</h1>
  <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" type="search" />
      </span>
    <Button
        label="+ Добавить университет"
        @click="dialogIsVisible = true"
    />
  </div>
  <div style="max-width: 50rem">
    <DataTable
        :value="universities"
        :loading="isLoading"
        striped-rows
        show-gridlines
        @row-click="editItem"
    >
      <template #empty>
        <p class="text-gray-600 text-center">Университеты не найдены</p>
      </template>
      <Column field="name" header="Название" />
      <Column field="code" header="Код" />
      <Column field="city.name" header="Город" />
    </DataTable>
    <Paginator
        v-model="page"
        :rows="size"
        :total-records="universitiesCount"
        @page="onPageChange"
    />
  </div>

  <UniversityCreateDialog v-model:model-value="dialogIsVisible" :item="editableItem" @close="onCloseDialog"/>
</template>

<style scoped lang="scss">

</style>
