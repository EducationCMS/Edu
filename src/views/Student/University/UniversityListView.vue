<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getImageUrl } from "@/helpers/getters"
import http from "@/plugins/axios"
import { useRouter } from "vue-router"
import ProgressSpinner from "primevue/progressspinner"
import type { IUniversity } from "@/views/Student/University/UniversityDetailView.vue"
import UniversityCard from "@/components/Student/University/UniversityCard"

const router = useRouter()

const search = ref("")
const isLoading = ref(false)
const universities = ref<IUniversity[]>([])

const getUniversities = async() => {
  isLoading.value = true
  try {
    const { data } = await http.get(`university/get-all`)
    universities.value = data?.items ?? []
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isLoading.value = false
  }
}

onMounted(getUniversities)
</script>

<template>
  <h1 class="font-semibold">ЖОО</h1>
  <div>
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText v-model="search" placeholder="Іздеу" type="search" />
    </span>
  </div>
  <div v-if="isLoading" class="flex justify-content-center my-5">
    <ProgressSpinner />
  </div>
  <div v-else class="flex flex-column gap-3 mt-6" style="max-width: 1000px">
    <UniversityCard
      v-for="university in universities"
      :key="university.id"
      :id="university.id"
      :address="university.address"
      :city="university.city?.name ?? ''"
      :name="university.name"
      :specializations-count="university.specializations?.length ?? 0"
      :url="getImageUrl(university.mediaFiles?.url)"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
