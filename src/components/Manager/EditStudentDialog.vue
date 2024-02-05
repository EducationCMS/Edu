<script setup lang="ts">
import { defineModel, ref } from "vue"
import type { ICity, IRegion, ISchool, IUser } from "@/stores/user"
import Input from "@/components/Form/Input"
import PhoneInput from "@/components/Form/PhoneInput"
import http from "@/plugins/axios"
import type { AutoCompleteCompleteEvent } from "primevue/autocomplete"

const modelValue = defineModel<boolean>()
const props = defineProps<{
  student: IUser
}>()
const emits = defineEmits(['close'])

const student_data = ref<IUser>(props.student)
const city = ref(props.student.city?.name)
const region = ref(props.student.city?.region?.name)
const school = ref(props.student.school?.name)
const cities = ref<ICity[]>([])
const regions = ref<IRegion[]>([])
const schools = ref<ISchool[]>([])
const errors = ref<{ [key: string]: string }>({})
const is_saving = ref(false)

const searchCity = async(value: AutoCompleteCompleteEvent) => {
  try {
    const { data } = await http.get('cities', {
      params: {
        name: value.query
      }
    })
    cities.value = data || []
  } catch(err) {
    cities.value = []
    console.error(err)
    throw err
  }
}

const searchRegion = async(value: AutoCompleteCompleteEvent) => {
  try {
    const { data } = await http.get('regions', {
      params: {
        name: value.query
      }
    })
    regions.value = data || []
  } catch(err) {
    regions.value = []
    console.error(err)
    throw err
  }
}

const searchSchool = async(value: AutoCompleteCompleteEvent) => {
  try {
    const { data } = await http.get('schools', {
      params: {
        name: value.query
      }
    })
    schools.value = data || []
  } catch(err) {
    schools.value = []
    console.error(err)
    throw err
  }
}

const onSelectCityChange = ({ value }: { value: { id: number, name: string }|string }) => {
  student_data.value.city = typeof value === "object" ? value.name : value
}
const onSelectRegionChange = ({ value }: { value: { id: number, name: string }|string }) => {
  student_data.value.city.region = typeof value === "object" ? value.name : value
}
const onSelectSchoolChange = ({ value }: { value: { id: number, name: string }|string }) => {
  student_data.value.school = typeof value === "object" ? value.name : value
}

const saveStudent = async() => {
  try {
    const { data } = await http.put('', student_data)
  } catch(e) {
    console.error(e)
    throw e
  }
}
// const getStudent = async() => {
//   try {
//
//   } catch(e) {
//     console.error(e)
//     throw e
//   }
// }
</script>

<template>
  <Dialog v-model:visible="modelValue" modal header="Оқушы туралы ақпарат" :style="{ width: '70vw' }" @after-hide="emits('close')">
    <div class="formgrid grid" >
      <div class="field col-4">
        <Input
          v-model="student_data.firstName"
          label="Аты"
          :error="errors['firstName']"
        />
      </div>
      <div class="field col-4">
        <Input
          v-model="student_data.lastName"
          label="Жөні"
          :error="errors['lastName']"
        />
      </div>
      <div class="field col-4">
        <Input
          v-model="student_data.middleName"
          label="Тегі (міндетті емес)"
          :error="errors['middleName']"
        />
      </div>
      <div class="field col-4">
        <div>
          <label for="city" class="font-semibold block mb-2">Қаласы, ауданы</label>
          <AutoComplete
            v-model="city"
            id="city"
            input-class="w-full"
            class="w-full"
            option-label="name"
            :suggestions="cities"
            @change="onSelectCityChange"
            @complete="searchCity"
            :class="[errors['city'] && 'p-invalid']"
          />
          <small v-if="errors['city']" class="p-error" id="city_error">{{ errors['city'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div class="field col-4">
        <div>
          <label for="region" class="font-semibold block mb-2">Облысы</label>
          <AutoComplete
            v-model="region"
            id="region"
            input-class="w-full"
            class="w-full"
            option-label="name"
            :suggestions="regions"
            @change="onSelectRegionChange"
            @complete="searchRegion"
            :class="[errors['region'] && 'p-invalid']"
          />
          <small v-if="errors['region']" class="p-error" id="region_error">{{ errors['region'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div class="field col-4">
        <div>
          <label for="school" class="font-semibold block mb-2">Мектебі</label>
          <AutoComplete
            v-model="school"
            id="school"
            input-class="w-full"
            class="w-full"
            option-label="name"
            :suggestions="schools"
            @change="onSelectSchoolChange"
            @complete="searchSchool"
            :class="[errors['school'] && 'p-invalid']"
          />
          <small v-if="errors['school']" class="p-error" id="school_error">{{ errors['school'] ?? '&nbsp;'  }}</small>
        </div>
      </div>
      <div class="field col-8">
        <PhoneInput v-model="student_data.phoneNumber" label="Оқушының телефоны" :error="errors['phoneNumber']"/>
      </div>
      <div class="field col-8">
        <PhoneInput v-model="student_data.parents_phone_number" label="Ата-ана телефоны" :error="errors['parentsNumbers']"/>
      </div>
      <div class="field col-8">
        <Input
          v-model="student_data.email"
          label="E-mail"
          :error="errors['email']"
        />
      </div>
      <div class="field col-8">
        <Input
          v-model="student_data.iin"
          label="ЖСН (ИИН)"
          :error="errors['iin']"
        />
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
          label="Сақтау"
          :loading="is_saving"
          @click="saveStudent"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
