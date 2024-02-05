<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import ProgressSpinner from "primevue/progressspinner"
import type { IUniversity } from "@/views/Student/University/UniversityDetailView.vue"
import type { ICourse } from "@/views/Admin/Course/CourseListView.vue"
import { getImageUrl } from "@/helpers/getters"
import UniversityCard from "@/components/Student/University/UniversityCard"
import Comments from "@/components/Student/Comments"

export interface ISpecialization {
  id: number,
  name: string,
  code: string,
  grandScore: number,
  grandCount: number,
  averageSalary: number,
  description: string,
  demand: 'High'|'Average'|'Low',
  universities: IUniversity[],
  subjects: ICourse[]
}

const props = defineProps(["id"])

const specialization = ref<ISpecialization>()
const isLoading = ref(false)
const activeTab = ref(0)

const getSpecialization = async() => {
  isLoading.value = true
  try {
    const { data } = await http.get(`specialization/get-by-id/${props.id}`)
    specialization.value = data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isLoading.value = false
  }
}

const getDemandText = (value: string) => {
  return {
    'High': 'Жоғары',
    'Average': 'Орташа',
    'Low': 'Төмен',
  }[value]
}

onMounted(getSpecialization)
</script>

<template>
  <div v-if="isLoading" class="flex justify-content-center my-6">
    <ProgressSpinner />
  </div>
  <template v-else-if="!!specialization">
    <div class="font-semibold text-lg">
      <span>ЖОО > Мамандықтар</span>
    </div>
    <h1 class="mt-6">{{ specialization.name }}</h1>
    <p class="text-gray-500 font-medium text-lg">Пәндер: {{ specialization.subjects.map(subject => subject.name).join(', ') }}</p>
    <div class="mt-6">
      <Button label="Сипаттама" :text="activeTab !== 0" class="px-5" @click="activeTab = 0" />
      <Button label="Университеттер" :text="activeTab !== 1" class="px-5" @click="activeTab = 1" />
    </div>
    <template v-if="activeTab === 0">
      <div class="grid gap-6 mt-4">
        <div class="col-3 flex flex-column gap-3">
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Код</span>
            <span class="font-medium text-gray-500">{{ specialization.code }}</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Грант саны</span>
            <span class="font-medium text-gray-500">{{ specialization.grandCount }}</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Грантқа шекті балл</span>
            <span class="font-medium text-gray-500">{{ specialization.grandScore }}</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Орташа жалақы</span>
            <span class="font-medium text-gray-500">{{ specialization.averageSalary }}</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Сұраныс</span>
            <span class="font-medium text-gray-500">{{ getDemandText(specialization.demand) }}</span>
          </div>
        </div>
        <div class="col-8">
          <p class="my-0">{{ specialization.description }}</p>
        </div>
      </div>
    </template>
    <template v-else-if="activeTab === 1">
      <div class="flex flex-column mt-6">
        <UniversityCard
          v-for="university in specialization.universities ?? []"
          :key="university.id"
          :id="university.id"
          :address="university.address"
          :city="university.city?.name ?? ''"
          :name="university.name"
          :specializations-count="university.specializations?.length ?? 0"
          :url="getImageUrl(university.mediaFiles.url)"
        />
      </div>
    </template>

    <div v-if="activeTab === 0" class="mt-6">
      <Comments :model-id="specialization.id" model="Specialization" />
    </div>
  </template>
</template>

<style scoped lang="scss">

</style>
