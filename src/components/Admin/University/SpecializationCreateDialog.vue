<script setup lang="ts">
import { defineModel, reactive, ref, watch } from "vue"
import InputNumber from "primevue/inputnumber"
import http from "@/plugins/axios"
import Textarea from "primevue/textarea"

const props = defineProps<{
  item?: object
}>()
const emits = defineEmits(["close"])
const modelValue = defineModel<boolean>()

const form = reactive({
  name: "",
  description: '',
  grandScore: null,
  grandCount: null,
  averageSalary: null,
  demand: "",
  code: "",
  subjects: []
})
const errors = ref({})
const isCreating = ref(false)
const demandList = ref([
  { value: "High", label: "Жоғары" },
  { value: "Average", label: "Орташа" },
  { value: "Low", label: "Төмен" }
])
const subjects = ref([])


watch(() => modelValue.value, (newValue) => {
  if(newValue) getSubjects()
})

const onDialogClose = () => {
  form.name = ""
  form.description = ""
  form.subjects = []
  form.code = ''
  form.demand = ''
  form.grandCount = null
  form.grandScore = null
  form.averageSalary = null
  emits('close')
}

const hasKey = (key: string) => {
  return Object.prototype.hasOwnProperty.call(errors.value, key)
}

const getSubjects = async() => {
  try {
    const { data } = await http.get('admin/subjects')
    subjects.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const createSpecialization = async() => {
  isCreating.value = true
  try {
    await http.post(`admin/specializations`, form)
    onDialogClose()
  } catch(e) {
    console.error()
    throw e
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    header="Жаңа мамандық қосу"
    :style="{ width: '40vw' }"
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
          <label for="middle_name" class="font-semibold">Сұраныс</label>
          <Dropdown
            v-model="form.demand"
            placeholder="Сұраныс"
            :options="demandList"
            option-label="label"
            option-value="value"
          />
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Грантқа ең төменгі балл</label>
          <InputNumber
            v-model="form.grandScore"
            inputId="minmax-buttons"
            mode="decimal"
            showButtons
            :min="0"
            :max="150"
          />
          <small v-if="errors['code']" class="p-error" id="last_name_error">{{ errors["code"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Грант саны</label>
          <InputNumber
            v-model="form.grandCount"
            inputId="minmax-buttons"
            mode="decimal"
            showButtons
            :min="0"
          />
          <small v-if="errors['code']" class="p-error" id="last_name_error">{{ errors["code"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Орташа жалақы</label>
          <InputNumber
            v-model="form.averageSalary"
            inputId="minmax-buttons"
            mode="decimal"
            showButtons
            :min="0"
          />
          <small
            v-if="errors['code']"
            class="p-error"
            id="last_name_error"
          >{{ errors["averageSalary"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-6">
        <div class="flex flex-column gap-2">
          <label for="last_name" class="font-semibold">Пәндер</label>
          <MultiSelect
            v-model="form.subjects" :options="subjects" optionLabel="name" placeholder=""
            :maxSelectedLabels="2"
          />
          <small
            v-if="errors['code']"
            class="p-error"
            id="last_name_error"
          >{{ errors["averageSalary"] ?? "&nbsp;" }}</small>
        </div>
      </div>
      <div class="field col-12">
        <label class="font-semibold">Қысқаша сипаттамасы</label>
        <Textarea v-model="form.description" rows="5" :class="[!!errors['description'] && 'p-invalid']" style="width: 100%"/>
        <small v-if="errors['description']" class="p-error">{{ errors['description'] ?? '&nbsp;'  }}</small>
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
          label="Сақтау"
          :loading="isCreating"
          @click="createSpecialization"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
