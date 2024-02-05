<script setup lang="ts">
import { onMounted, ref } from "vue"
import http from "@/plugins/axios"
import ProgressSpinner from "primevue/progressspinner"
import { getImageUrl } from "@/helpers/getters"
import SpecializationCard from "@/components/Student/University/SpecializationCard"
import type { ICity } from "@/stores/user"
import type { ISpecialization } from "@/views/Student/University/SpecializationDetailView.vue"
import type { IMediaFile } from "@/views/Admin/Post/PostListView.vue"
import Comments from "@/components/Student/Comments"

export interface IUniversity {
  id: number,
  name: string,
  code: string,
  description: string,
  address: string,
  middlePrice: number,
  dormitory: boolean,
  militaryDepartment: boolean,
  city: ICity,
  specializations: ISpecialization[],
  mediaFiles: IMediaFile
}

const props = defineProps(["id"])

const university = ref<IUniversity>()
const isLoading = ref(false)
const activeTab = ref(0)

const getUniversity = async() => {
  isLoading.value = true
  try {
    const { data } = await http.get(`university/get-by-id/${props.id}`)
    university.value = data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isLoading.value = false
  }
}

onMounted(getUniversity)
</script>

<template>
  <div v-if="isLoading" class="flex justify-content-center my-6">
    <ProgressSpinner />
  </div>
  <template v-else-if="!!university">
    <div class="font-semibold text-lg">
      <span class="text-gray-700">ЖОО </span>
      <span v-if="university">{{ `> ${university.name}` }}</span>
    </div>
    <div class="grid my-5">
      <div class="col-3">
        <div class="flex justify-content-center align-items-center">
          <img
            v-if="university?.mediaFiles" :src="getImageUrl(university.mediaFiles.url)"
            style="width: 100%; height: auto; object-fit: contain"
          />
        </div>
      </div>
      <div class="col-9">
        <p class="text-xl font-bold">{{ university?.name }}</p>
        <p class="text-lg text-gray-500">Код: {{ university?.code }}</p>
        <p class="text-lg text-gray-500">{{ university?.city.name }} қаласы, {{ university?.address }}</p>
      </div>
    </div>
    <div class="mt-6">
      <Button label="Сипаттама" :text="activeTab !== 0" class="px-5" @click="activeTab = 0" />
      <Button label="Мамандықтар" :text="activeTab !== 1" class="px-5" @click="activeTab = 1" />
    </div>
    <template v-if="activeTab === 0">
      <div class="grid gap-6 mt-4">
        <div class="col-3 flex flex-column gap-3">
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Орташа бағасы</span>
            <span class="font-medium text-gray-500">{{ university?.middlePrice.toLocaleString("ru-RU") }} ТГ</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Статус</span>
            <span class="font-medium text-gray-500">Бірлескен</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Жатақхана</span>
            <span class="font-medium text-gray-500">{{ university?.dormitory ? "Иә" : "Жоқ" }}</span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-primary font-semibold">Әскери кафедра</span>
            <span class="font-medium text-gray-500">{{ university?.militaryDepartment ? "Иә" : "Жоқ" }}</span>
          </div>
        </div>
        <div class="col-8">
          <p class="my-0">{{ university?.description }}</p>
        </div>
      </div>
    </template>
    <template v-else-if="activeTab === 1">
      <div class="grid mt-5">
        <div
          class="col-4"
          v-for="specialization in university?.specializations ?? []"
          :key="specialization.id"
        >
          <SpecializationCard
            :id="specialization.id"
            :code="specialization.code"
            :name="specialization.name"
            :grand-score="specialization.grandScore"
            :grand-count="specialization.grandCount"
          />
        </div>
      </div>
    </template>

    <div v-if="activeTab === 0" class="mt-6">
      <Comments :model-id="university.id" model="University" />
    </div>
  </template>

</template>

<style scoped lang="scss">

</style>
