<script lang="ts" setup>
import { defineAsyncComponent, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import ConfirmPopup from "primevue/confirmpopup"

const EmptyLayout = defineAsyncComponent(() => import("@/layouts/EmptyLayout.vue"))
const DefaultLayout = defineAsyncComponent(() => import("@/layouts/DefaultLayout.vue"))

const route = useRoute()
const { GET_USER } = useUserStore()

// const { SET_USER, SET_TOKEN } = useSession()
//
// const getCurrentUser = async(token: string) => {
//   try {
//     const { data } = await http.get('me')
//     await SET_USER(data)
//     await SET_TOKEN(token)
//   } catch(err) {
//     console.error(err)
//     throw err
//   }
// }

onMounted(() => {
  const token = window.localStorage.getItem('@access-token')
  if(token) GET_USER()
  // if(token) getCurrentUser(token)
})
</script>

<template>
  <Suspense timeout="0">
    <component :is="route.meta.sidebar ? DefaultLayout : EmptyLayout">
      <Toast />
      <ConfirmPopup>
        <template #accepticon>
          <i class="pi pi-check"></i>
        </template>
        <template #rejecticon>
          <i class="pi pi-times"></i>
        </template>
      </ConfirmPopup>
      <RouterView />
    </component>
    <template #fallback>
      <div style="color: #a8abb2; font-weight: 300; text-align: center">
        <span>загрузка...</span>
      </div>
    </template>
  </Suspense>
</template>
