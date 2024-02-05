<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref, watch } from "vue"
import { useUserStore } from "@/stores/user"
import type { AxiosError } from "axios"
import Message from "primevue/message"
import { storeToRefs } from "pinia"

const router = useRouter()
const userStore = useUserStore()
const { LOGIN_USER } = userStore
const { user } = storeToRefs(userStore)

const is_loading = ref(false)
const email = ref("")
const password = ref("")
const error = ref('')

const authorize = async() => {
  is_loading.value = true
  error.value = ''
  try {
    const data = await LOGIN_USER({
      email: email.value,
      password: password.value
    })
    handleRouteChange(data?.appRole.name)
    // await router.push({ name: 'AdminAnalytics' })
  } catch(e) {
    const errors = e as AxiosError
    error.value = errors.response.data?.detail || 'Ошибка!'
  } finally {
    is_loading.value = false
  }
}

const handleRouteChange = (role: string) => {
  const routeName = {
    'ROLE_STUDENT': 'CourseList',
    'ROLE_ADMIN': 'AdminAnalytics',
    'ROLE_MANAGER': 'ManagerStudentList',
    'ROLE_TEACHER': 'TeacherGroupList'
  }[role]
  router.push({ name: routeName })
}

watch(user, (newValue) => {
  if(newValue) handleRouteChange(newValue.appRole.name)
})
</script>

<template>
  <div class="flex flex-column h-screen">
    <div class="py-2 px-6">
      <img
        src="@/assets/images/logo.png"
        alt="inSight logo"
        class="logo cursor-pointer"
        @click="router.push({ name: 'Home' })"
      />
    </div>
    <div class="flex justify-content-center flex-grow-1">
      <div class="login px-5 pt-3 pb-8 mt-8 mb-auto">
        <p class="text-xl font-medium mb-6">Bilimlab платформасына қош келдіңіз!</p>
        <div class="flex flex-column gap-2 mb-4">
          <label for="email" class="font-light">Пошта</label>
          <InputText v-model="email" id="email" placeholder="Поштаңызды енгізіңіз" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password" class="font-light">Пароль</label>
          <Password
            v-model="password"
            id="password"
            class="w-full p-password p-component p-inputwrapper p-input-icon-right"
            input-class="w-full"
            toggleMask
            :feedback="false"
            @keyup.enter="authorize"
          />
        </div>
        <router-link to="/forgot-password" class="no-underline font-light text-sm text-primary">
          <p>Құпиясөзді ұмыттыңыз ба?</p>
        </router-link>
        <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
        <Button label="Кіру" class="mt-5 w-full" :loading="is_loading" @click="authorize" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  background: #fff;
  box-shadow: 0 4px 35px rgba(0, 0, 0, 0.08);
  border-radius: 30px;
}

</style>
