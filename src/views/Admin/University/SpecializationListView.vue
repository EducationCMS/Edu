<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import http from "@/plugins/axios"
import SpecializationCreateDialog from "@/components/Admin/University/SpecializationCreateDialog"
import Tag from "primevue/tag"
import Paginator, { type PageState } from "primevue/paginator"

const isLoading = ref(false)
const search = ref('')
const page = ref(1)
const size = ref(10)
const delayTimer = ref<ReturnType<typeof setTimeout>>()
const specializations = ref([])
const specializationsCount = ref(0)
const dialogIsVisible = ref(false)

watch(() => search.value, () => {
  clearTimeout(delayTimer.value)
  delayTimer.value = setTimeout(() => {
    getSpecializations()
  }, 300)
})

const getSpecializations = async() => {
  isLoading.value = true
  try {
    const { data } = await http.get('admin/specializations', {
      params: {
        page: page.value,
        size: size.value,
        ...(search.value && { query: search.value })
      }
    })
    specializations.value = data?.items ?? []
    specializationsCount.value = data?.totalCount ?? 0
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  getSpecializations()
}

const getDemandText = (demand: string) => {
  return {
    'High': 'Высокий',
    'Average': 'Средний',
    'Low': 'Низкий',
  }[demand]
}

const getDemandType = (demand: string) => {
  return {
    'High': 'success',
    'Average': 'warning',
    'Low': 'danger',
  }[demand]
}

const onCloseDialog = () => {
  dialogIsVisible.value = false
  getSpecializations()
}

onMounted(getSpecializations)
</script>

<template>
  <h1 class="font-semibold">Добавление специализации</h1>
  <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Поиск" type="search" />
      </span>
    <Button
        label="+ Добавить специализацию"
        @click="dialogIsVisible = true"
    />
  </div>
  <div style="max-width: 50rem">
    <DataTable
        :value="specializations"
        :loading="isLoading"
        striped-rows
        show-gridlines
    >
      <template #empty>
        <p class="text-gray-600 text-center">Специализации не найдены</p>
      </template>
      <Column field="name" header="Название" />
      <Column field="code" header="Код" />
      <Column field="grandCount" header="Количество грантов"></Column>
      <Column field="email" header="Предметы">
        <template #body="{ data }">
          {{ data.subjects?.map(subject => subject.name).join(', ') }}
        </template>
      </Column>
      <Column field="email" header="Спрос">
        <template #body="{ data }">
          <Tag :severity="getDemandType(data.demand)" :value="getDemandText(data.demand)" />
        </template>
      </Column>
    </DataTable>
    <Paginator
        v-model="page"
        :rows="size"
        :total-records="specializationsCount"
        @page="onPageChange"
    />
  </div>

  <SpecializationCreateDialog v-model:model-value="dialogIsVisible" @close="onCloseDialog"/>
</template>

<style scoped lang="scss">

</style>
