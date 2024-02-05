<script setup lang="ts">
import type { IUser } from "@/stores/user"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import { computed, reactive, ref, watch } from "vue"
import PhoneInput from "@/components/Form/PhoneInput.vue"
import http from "@/plugins/axios"
import { useToast } from "primevue/usetoast"
import Input from "@/components/Form/Input.vue"
import axios from "axios"
import { getImageUrl } from "@/helpers/getters"

const toast = useToast()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const user_data = reactive<IUser>({})
const is_avatar_updating = ref(false)
const is_updating = ref(false)
const active_form = ref(0)
const errors = ref({})
const file_input = ref()

const new_password = ref("")
const new_password_repeat = ref("")
const is_password_changing = ref(false)
const password_errors = ref<{ [key: string]: string }>({})

const roleName = computed(() => {
  if(!user.value?.appRole?.name) return ""
  return {
    "ROLE_TEACHER": "Мұғалім",
    "ROLE_STUDENT": "Оқушы"
  }[user.value?.appRole?.name]
})

watch(() => user.value, (user) => {
  if(user) Object.assign(user_data, user)
}, { immediate: true })

const updateProfile = async() => {
  is_updating.value = true
  errors.value = {}

  try {
    const { data } = await http.patch("update-profile", {
      id: user_data.id,
      firstName: user_data.firstName,
      lastName: user_data.lastName,
      middleName: user_data.middleName,
      phoneNumber: user_data.phoneNumber,
      email: user_data.email,
      ...user.value
    })
    userStore.$patch({
      user: data
    })
    toast.add({ severity: "success", summary: "Ура!", detail: "Профиль өгертілді!", life: 3000 })
  } catch(err) {
    if(axios.isAxiosError(err)) {
      // const fieldErrors = err.response?.data?.['fieldErrors'] as IFieldError
      errors.value = err.response?.data?.["fieldErrors"] || {}
    } else {
      console.error(err)
      throw err
    }
  } finally {
    is_updating.value = false
  }
}

const changePassword = async() => {
  password_errors.value = {}
  is_password_changing.value = true
  try {
    await http.put("reset-password", {
      password: new_password.value,
      passwordConfirmation: new_password_repeat.value
    })
    toast.add({ severity: "success", summary: "Ура!", detail: "Пароль өгертілді!", life: 3000 })
    new_password.value = ''
    new_password_repeat.value = ''
  } catch(err) {
    if(axios.isAxiosError(err)) {
      // const fieldErrors = err.response?.data?.['fieldErrors'] as IFieldError
      password_errors.value = err.response?.data?.["fieldErrors"] || {}
    } else {
      console.error(err)
      throw err
    }
  } finally {
    is_password_changing.value = false
  }
}

const uploadAvatar = async(file: File) => {
  is_avatar_updating.value = true
  try {
    const { data } = await http.post("media/upload-file", {
      type: "Avatar",
      file: file
    }, { headers: { "Content-Type": "multipart/form-data" } })
    user_data.avatar = data?.url ?? ""
    userStore.GET_USER()
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_avatar_updating.value = false
  }
}

const chooseFile = () => {
  file_input.value.click()
}

const onFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if(!target.files?.[0]) throw new Error("Не удалось выбрать файл")

  uploadAvatar(target.files[0])
}
</script>

<template>
  <h1>Профиль</h1>
  <div v-if="user" class="my-6 gap-5">
    <div class="flex align-items-center gap-7">
      <div class="relative">
        <Avatar
          class="w-12rem h-12rem text-7xl"
          shape="circle"
          :label="!user_data.avatar ? user_data.firstName[0].toUpperCase() : null"
          :image="user_data.avatar ? getImageUrl(user_data.avatar) : null"
        />
        <Button
          icon="pi pi-camera"
          :loading="is_avatar_updating"
          rounded
          class="absolute bottom-0 right-0"
          @click="chooseFile"
        />
        <input
          ref="file_input"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          @change="onFileInputChange"
          hidden
        />
      </div>
      <div class="h-10rem flex flex-column justify-content-center">
        <p class="mb-0 text-4xl font-bold">{{ user.firstName }} {{ user.lastName }}</p>
        <h4 class="mt-2">{{ roleName }}</h4>
      </div>
    </div>
    <div class="flex gap-7 mt-7">
      <div class="w-12rem bg-primary-50 flex flex-column align-items-center border-2 border-primary border-round align-self-baseline p-1">
        <Button label="Өзгерту" class="w-full" size="small" :text="active_form !== 0" @click="active_form = 0" />
        <Button
          label="Қауіпсіздік"
          class="w-full mt-2"
          size="small"
          :text="active_form !== 1"
          @click="active_form = 1"
        />
      </div>
      <div v-if="active_form === 0" style="max-width: 700px">
        <p class="text-2xl mt-2 mb-4 font-semibold">Профильды өзгерту</p>
        <div class="formgrid grid">
          <div class="field col-6">
            <div class="flex flex-column gap-2">
              <Input
                v-model="user_data.firstName"
                label="Аты"
                id="first_name"
                :error="errors['firstName']"
              />
            </div>
          </div>
          <div class="field col-6">
            <div class="flex flex-column gap-2">
              <Input
                v-model="user_data.lastName"
                label="Жөні"
                id="last_name"
                :error="errors['lastName']"
              />
            </div>
          </div>
          <div class="field col-6">
            <div class="flex flex-column gap-2">
              <Input
                v-model="user_data.middleName"
                label="Тегі (міндетті емес)"
                id="middle_name"
                :error="errors['middleName']"
              />
            </div>
          </div>
          <div class="field col-12">
            <div class="flex flex-column gap-2">
              <PhoneInput v-model="user_data.phoneNumber" label="Телефон" :error="errors['phoneNumber']" />
            </div>
          </div>
          <div class="field col-12">
            <div class="flex flex-column gap-2">
              <Input
                v-model="user_data.email"
                label="E-mail"
                id="email"
                :error="errors['email']"
              />
            </div>
          </div>
          <!--          <div class="field col-12">-->
          <!--            <div class="flex flex-column gap-2">-->
          <!--              <label for="email" class="font-semibold">E-mail</label>-->
          <!--              <InputText-->
          <!--                id="email"-->
          <!--                aria-describedby="email_error"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="field col-12 flex justify-content-end mt-5">
            <Button
              label="Сақтау"
              :loading="is_updating"
              @click="updateProfile"
            />
          </div>
        </div>
      </div>
      <div v-else style="max-width: 700px">
        <p class="text-2xl mt-2 mb-4 font-semibold">Қауіпсіздік</p>
        <div class="formgrid grid">
          <div class="field col-12">
            <div class="flex flex-column gap-2">
              <Input
                v-model="new_password"
                id="new_password"
                label="Жаңа пароль"
                :error="password_errors['password']"
              />
            </div>
          </div>
          <div class="field col-12">
            <div class="flex flex-column gap-2">
              <Input
                v-model="new_password_repeat"
                id="new_password_repeat"
                label="Жаңа парольді қайталау"
              />
            </div>
          </div>
          <small v-if="new_password_repeat !== new_password" class="p-error ml-4">Парольдер ұқсас емес</small>
          <div class="field col-12 mt-4">
            <Button
              label="Парольді өзгерту"
              :loading="is_password_changing"
              :disabled="new_password !== new_password_repeat"
              @click="changePassword"
            />
          </div>
        </div>
      </div>
    </div>
    <!--    <div class="col-fixed flex flex-column align-items-center" style="max-width: 200px">-->
    <!--      <Button label="Өзгерту" class="mt-5 w-full" size="small"/>-->
    <!--      <Button label="Логин мен пароль" class="mt-4" size="small" text />-->

    <!--    </div>-->

  </div>
</template>

<style scoped lang="scss">

</style>
