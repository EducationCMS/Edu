<script setup lang="ts">
import { defineModel, reactive, ref, watch } from "vue"
import InputNumber from "primevue/inputnumber"
import http from "@/plugins/axios"
import Textarea from "primevue/textarea"
import Checkbox from "primevue/checkbox"
import FileUpload, { type FileUploadUploaderEvent } from "primevue/fileupload"
import { getImageUrl } from "@/helpers/getters"
import type { VirtualScrollerLazyEvent } from "primevue/virtualscroller"
import type { MultiSelectFilterEvent } from "primevue/multiselect"

const props = defineProps<{
  item?: object
}>()
const emits = defineEmits(["close"])
const modelValue = defineModel<boolean>()

const form = reactive({
  name: "",
  code: "",
  description: "",
  address: "",
  middlePrice: null,
  city: null,
  militaryDepartment: false,
  dormitory: false,
  specializations: []
})
const errors = ref({})
const isCreating = ref(false)
const fileIsUploading = ref(false)
const uploadedFile = ref()
const demandList = ref([
  { value: "High", label: "Жоғары" },
  { value: "Average", label: "Орташа" },
  { value: "Low", label: "Төмен" }
])
const cities = ref([])
const specializations = ref([])
const specializationsCount = ref(0)
const specializationsIsLoading = ref(false)
const search = ref('')
const page = ref(1)
const size = ref(25)


watch(() => modelValue.value, (newValue) => {
  if(newValue) {
    getCities()
    getSpecialization()
  }
})

watch(() => props.item, (newValue) => {
  if(newValue) {
    Object.assign(form, { ...newValue })
    uploadedFile.value = newValue.mediaFiles
  }
})

const onDialogClose = () => {
  form.name = ""
  form.description = ""
  form.specializations = []
  form.code = ""
  form.city = null
  form.militaryDepartment = false
  form.dormitory = false
  form.address = ""
  form.middlePrice = null
  emits("close")
}

const hasKey = (key: string) => {
  return Object.prototype.hasOwnProperty.call(errors.value, key)
}

const getCities = async() => {
  try {
    const { data } = await http.get("dictionary/cities")
    cities.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getSpecialization = async() => {
  specializationsIsLoading.value = true
  try {
    const { data } = await http.get("admin/specializations", {
      params: {
        page: page.value,
        size: size.value
      }
    })
    specializations.value = [...specializations.value, ...(data?.items || [])]
    specializationsCount.value = data?.totalCount ?? 0
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    specializationsIsLoading.value = false
  }
}

const createUniversity = async() => {
  isCreating.value = true

  try {
    if(props.item) await http.patch(`admin/universities`, {
      ...form,
      id: props.item.id,
      mediaFiles: uploadedFile.value
    })
    else await http.post(`admin/universities`, { ...form, mediaFiles: uploadedFile.value })
    onDialogClose()
  } catch(e) {
    console.error()
    throw e
  } finally {
    isCreating.value = false
  }
}

const uploadFile = async(file: File) => {
  fileIsUploading.value = true
  try {
    const { data } = await http.post("media/upload-file", {
      file
    }, { headers: { "Content-Type": "multipart/form-data" } })
    return data
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    fileIsUploading.value = false
  }
}

const uploadFiles = async(event: FileUploadUploaderEvent) => {
  const file = event.files?.at(0)
  uploadedFile.value = await uploadFile(file)
}

const deleteFile = async(id: string) => {
  try {
    await http.delete(`media/delete-file/${id}`)
    uploadedFile.value = undefined
  } catch(e) {
    console.error(e)
    throw e
  }
}

const onLazyLoad = (event: VirtualScrollerLazyEvent) => {
  if(event.last === specializations.value.length && !specializationsIsLoading.value && specializationsCount.value > specializations.value.length) {
    page.value = page.value + 1
    getSpecialization()
  }
}

const onFilter = (event: MultiSelectFilterEvent) => {
  console.log(event)
}
</script>

<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    header="ЖОО қосу"
    :style="{ width: '80%', maxWidth: '800px' }"
    @after-hide="onDialogClose"
  >
    <div class="formgrid grid">
      <div class="field col-12">
        <div class="flex flex-column gap-2">
          <label for="name" class="font-semibold">Аты</label>
          <InputText
            id="name"
            v-model="form.name"
            :class="[hasKey('name') && 'p-invalid']"
            aria-describedby="first_name_error"
          />
          <small v-if="errors['name']" class="p-error" id="first_name_error">{{ errors["name"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Коды</label>
          <InputText
            id="last_name"
            v-model="form.code"
            :class="[hasKey('code') && 'p-invalid']"
            aria-describedby="last_name_error"
          />
          <small v-if="errors['code']" class="p-error" id="last_name_error">{{ errors["code"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="middle_name" class="font-semibold">Қала</label>
          <Dropdown
            v-model="form.city"
            :options="cities"
            option-label="name"
          />
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Адрес</label>
          <InputText
            id="last_name"
            v-model="form.address"
            :class="[hasKey('address') && 'p-invalid']"
            aria-describedby="last_name_error"
          />
          <small
            v-if="errors['address']"
            class="p-error"
            id="last_name_error"
          >{{ errors["address"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Орташа бағасы</label>
          <InputNumber
            v-model="form.middlePrice"
            inputId="minmax-buttons"
            mode="decimal"
            showButtons
            :min="0"
          />
          <small
            v-if="errors['middlePrice']"
            class="p-error"
            id="last_name_error"
          >{{ errors["middlePrice"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-12">
        <div class="flex gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="form.dormitory" inputId="ingredient1" binary name="pizza" :value="true" />
            <label for="ingredient1" class="ml-2">Жатақхана</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="form.militaryDepartment" inputId="ingredient2" binary name="pizza" :value="true" />
            <label for="ingredient2" class="ml-2">Әскери кафедра</label>
          </div>
        </div>
      </div>
      <div class="field col-12">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Мамандықтар</label>
          <MultiSelect
            v-model="form.specializations"
            data-key="id"
            :options="specializations"
            optionLabel="name"
            filter
            :virtual-scroller-options="{
              lazy: true,
              onLazyLoad: onLazyLoad,
              itemSize: 25,
            }"
            :selection-message="'Таңдалды: {0}'"
            :maxSelectedLabels="2"
          />
          <small
            v-if="errors['specializations']"
            class="p-error"
            id="last_name_error"
          >{{ errors["specializations"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-12">
        <label class="font-semibold">Қысқаша сипаттамасы</label>
        <Textarea
          v-model="form.description"
          rows="5"
          :class="[!!errors['description'] && 'p-invalid']"
          style="width: 100%"
        />
        <small v-if="errors['description']" class="p-error">{{ errors["description"] ?? "&nbsp;" }}</small>
      </div>
      <div class="field col-12">
        <label for="photo" class="font-semibold">ЖОО суреті</label>
        <div v-if="!!uploadedFile" class="relative w-fit">
          <img :src="getImageUrl(uploadedFile.url)" style="width: 100%; height: auto" />
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            class="absolute"
            style="right: 1rem; top: 1rem"
            @click="deleteFile(uploadedFile.id)"
          ></Button>
        </div>
        <FileUpload
          v-else
          auto
          mode="basic"
          custom-upload
          :maxFileSize="1000000"
          :choose-label="fileIsUploading ? 'Загружается' : 'Қосу'"
          upload-label="Жүктеу"
          cancel-label="Отмена"
          :accept="'image/*'"
          :disabled="fileIsUploading"
          @uploader="uploadFiles"
        >
          <template #empty>
            <p class="my-0">Файлдарды жүктеңіз</p>
          </template>
        </FileUpload>
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
          label="Сақтау"
          :loading="isCreating || fileIsUploading"
          @click="createUniversity"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
