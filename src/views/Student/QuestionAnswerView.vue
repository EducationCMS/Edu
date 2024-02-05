<script setup lang="ts">
import { reactive, ref } from "vue"
import SelectButton from "primevue/selectbutton"
import Textarea from "primevue/textarea"
import Checkbox from "primevue/checkbox"
import RadioButton from "primevue/radiobutton"
import Button from "primevue/button"
import http from "@/plugins/axios"
import { useToast } from "primevue/usetoast"

const toast = useToast()

const types = ref([
  { name: 'Платформа бойынша', value: 'PLATFORM' },
  { name: 'Сабақтар бойынша ', value: 'COURSE' },
  { name: 'Төлем бойынша', value: 'PAYMENT' },
  { name: 'Басқа', value: 'ANOTHER' },
])
const targets = ref([
  { name: 'Мұғалімге', value: 'TEACHER' },
  { name: 'Кураторға', value: 'CURATOR' },
  { name: 'Психологқа', value: 'PSYCHOLOGIST' },
  { name: 'Техподдержка', value: 'SUPPORT' },
])
const form = reactive({
  type: '',
  toWhom: '',
  anonymous: false,
  checked: false,
  description: ''
})
const isSending = ref(false)

const sendQuestion = async() => {
  isSending.value = true
  try {
    await http.post('question-answer', form)
    Object.assign(form, {
      type: '',
      toWhom: '',
      anonymous: false,
      checked: false,
      description: ''
    })
    toast.add({ severity: 'success', summary: 'Сәтті!', detail: 'Сіздің сұрағыңыз жіберілді!', life: 5000 });
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <h1>Сұрақ - Жауап</h1>
  <div>
    <div class="flex flex-column gap-2">
      <p class="mb-3 font-semibold text-lg">Сұрақ тақырыбы</p>
      <div v-for="type in types" :key="type.value" class="flex align-items-center">
        <RadioButton v-model="form.type" :inputId="type.value" :value="type.value" />
        <label :for="type.value" class="ml-2 cursor-pointer">{{ type.name }}</label>
      </div>
    </div>
    <div class="mt-4">
      <p class="mb-2 font-semibold text-lg">Кімге?</p>
      <SelectButton
        v-model="form.toWhom"
        :options="targets"
        option-label="name"
        option-value="value"
      />
    </div>
    <div class="mt-6">
      <p class="text-xl font-semibold">Өзіңіздің сұрағыңызды жазыңыз</p>
      <Textarea v-model="form.description" class="w-full" rows="5" placeholder="Сұрақ туралы жазыңыз" />
    </div>
    <div class="flex justify-content-end gap-4 my-4">
      <div class="flex align-items-center">
        <Checkbox v-model="form.anonymous" inputId="anon" binary name="anon" :value="true" />
        <label for="anon" class="ml-2 cursor-pointer">Анонимді</label>
      </div>
      <Button label="Жіберу" @click="sendQuestion" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
