<script setup lang="ts">
import { useRouter } from "vue-router"
import { computed, defineAsyncComponent } from "vue"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"

const ADMIN_MENU_ITEMS = [
  // { label: 'Аналитика', icon: 'analytics', routeName: 'AdminAnalytics' },
  // { label: 'Добавить менеджера', icon: 'add_user', routeName: 'AdminManagerList' },
  { label: 'Добавить учителя', icon: 'student', routeName: 'AdminTeacherList' },
  { label: 'Добавить класс', icon: 'user_group', routeName: 'AdminGroupList' },
  // { label: 'Оқушылар', icon: 'user_list', routeName: 'ManagerStudentList' },
  // { label: 'Онлайн тесттер', icon: 'test', routeName: 'AdminOnlineTestList' },
  { label: 'Добавить курс', icon: 'graduation_cap', routeName: 'AdminCourseList' },
  // { label: 'Тест қосу', icon: 'exam', routeName: 'AdminTestList' },
  { label: 'Добавить профессию', icon: 'star', routeName: 'AdminSpecializationList' },
  { label: 'Университеты', icon: 'plus', routeName: 'AdminUniversityList' },
  // { label: 'Новости', icon: 'newspaper', routeName: 'AdminPostList' },
]

const MANAGER_MENU_ITEMS = [
  { label: 'Оқушыны қосу', icon: 'plus', routeName: 'ManagerCreateStudent' },
  { label: 'Барлық оқушылар', icon: 'user_group', routeName: 'ManagerStudentList' },
  { label: 'Менің оқушыларым', icon: 'user_circle', routeName: 'ManagerMyStudentList' },
]

const TEACHER_MENU_ITEMS = [
  { label: 'Басты бет', icon: 'star', routeName: 'TeacherMain' },
  { label: 'Профиль', icon: 'user', routeName: 'Profile' },
  { label: 'Сыныптар', icon: 'user_group', routeName: 'TeacherGroupList' },
  // { label: 'Тапсырмалар', icon: 'pencil', routeName: 'TeacherTask' },
  // { label: 'Бағалар', icon: 'text_check', routeName: 'TeacherGrade' },
  // { label: 'Аналитика', icon: 'analytics', routeName: 'TeacherAnalytics' },
]

const STUDENT_MENU_ITEMS = [
  { label: 'Курстар', icon: 'star', routeName: 'CourseList' },
  { label: 'Профиль', icon: 'user', routeName: 'Profile' },
  { label: 'Оқу үлгерімі', icon: 'bookmark', routeName: 'Progress' },
  { label: 'Сұрақ - Жауап', icon: 'question', routeName: 'QuestionAnswer' },
  { label: 'Жаңалықтар', icon: 'globe', routeName: 'PostList' },
  { label: 'ЖОО', icon: 'graduation_cap', routeName: 'UniversityList' },
  // { label: 'Сыныптар', icon: 'user_group', routeName: 'TeacherGroupList' },
  // { label: 'Тапсырмалар', icon: 'pencil', routeName: 'TeacherTask' },
  // { label: 'Бағалар', icon: 'text_check', routeName: 'TeacherGrade' },
  // { label: 'Аналитика', icon: 'analytics', routeName: 'TeacherAnalytics' },
]

// Kuz0WmLv8RZHXlMoYE8u - naruto@gmail.com
// PMoUIbyACyNHwAuRwpr5 - asuma@gmail.com
// tEACs1KCsriB301KaJWU - asuma_@gmail.com
// E9PnsFtCYENgUvABksSW - manager_@gmail.com
// 4dAE7jx5F3msCLX04HTC - shika@gmail.kz

// mHR5LMBg25RB4tXTPvNq - student@bilim-lab.kz

const router = useRouter()
const current_router_name = computed(() => router.currentRoute.value.name)
const userStore = useUserStore()
const { LOGOUT_USER } = userStore
// const { user, SET_USER } = useSession()
// const { SET_LAYOUT } = useSettings()

const { user } = storeToRefs(userStore)

const menu_items = computed(() => {
  if(!user.value?.appRole?.name) return []
  const items = {
    'ROLE_ADMIN': ADMIN_MENU_ITEMS,
    'ROLE_MANAGER': MANAGER_MENU_ITEMS,
    'ROLE_TEACHER': TEACHER_MENU_ITEMS,
    'ROLE_STUDENT': STUDENT_MENU_ITEMS,
  }[user.value?.appRole?.name] || []
  return items
})
const getIcon = (name: string) => {
  return defineAsyncComponent(() => import(`@/assets/images/icons/sidebar/${name}.svg`))
}

const logout = () => {
  LOGOUT_USER()
  router.push({ name: "Home" })
}
</script>

<template>
  <div class="relative">
    <div class="layout__sidebar flex flex-column">
      <h1
          style="color: #ffffff"
        class="layout__sidebar__logo cursor-pointer align-self-center mb-4"
        @click="router.push({ name: 'Home' })"
      >
        TestKenes
      </h1>
      <router-link
        v-for="(item, index) in menu_items"
        :key="item.icon"
        class="flex align-items-center cursor-pointer px-4 py-3 layout__sidebar__menu-item"
        :to="{ name: item.routeName }"
        :exact="true"
        :exact-active-class="'is-active'"
      >
        <div class="layout__sidebar__menu-item__icon mr-2">
<!--          <component :is="getIcon(item.icon)" />-->
<!--          <img :src="`/src/assets/images/icons/sidebar/${item.icon}.svg`" :alt="item.label"/>-->
        </div>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
    <div>
      <header class="layout__header flex justify-content-end align-items-center">
        <div class="flex align-items-center gap-4">
<!--          <i class="pi pi-bell text-xl"></i>-->
          <div v-if="user" class="flex align-items-center cursor-pointer" @click="logout">
            <Avatar :label="user.firstName[0].toUpperCase()" class="mr-2" size="large" shape="circle" />
            <div>
              <p class="my-0 font-semibold">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="my-0 font-semibold text-gray-500">{{ user.email }}</p>
            </div>
          </div>
        </div>
      </header>
      <main class="layout__main px-6">
        <div class="w-full">
          <slot/>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  &__sidebar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    background-color: #333333;

    &__logo {
      width: 130px;
    }

    &__menu-item {
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      position: relative;

      &:hover {
        background-color: #555555;
      }

      &__icon {
        width: 1.25rem;
        height: 1.25rem;
        display: grid;
        place-items: center;
      }

      &.is-active {
        background-color: #555555;

        &::before {
          content: "";
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: -5px;
          width: 10px;
          border-radius: 12px;
          background-color: #333333;
        }
      }
    }
  }

  &__header {
    position: absolute;
    top: 0;
    right: 0;
    left: 250px;
    height: 80px;
  }

  &__main {
    position: absolute;
    left: 250px;
    top: 90px;
    right: 0;
  }
}
</style>
