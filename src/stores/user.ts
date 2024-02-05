import { acceptHMRUpdate, defineStore } from "pinia"
import http from "@/plugins/axios"
// @ts-ignore
import type { ICourse } from "@/views/Admin/Course/CourseListView"
// @ts-ignore
import type { IGroup } from "@/views/Admin/Group/GroupDetailView"
// import type { ICourse } from "@/views/Admin/Course/CourseListView.vue"
// import type { IGroup } from "@/views/Admin/Group/GroupDetailView"

export const EMPTY_LAYOUT = "empty-layout"
export const DEFAULT_LAYOUT = "default-layout"


export interface IRegion {
  id?: number,
  name: string
}

export interface ICity {
  id?: number,
  name: string,
  region?: IRegion
}

export interface ISchool {
  id?: number,
  name: string
}
export interface IUser {
  id: number,
  age: number,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  login: string,
  middleName: string,
  appRole: IRole,
  avatar: string,
  subjects: ICourse[],
  city: ICity,
  school: ISchool,
  iin: string,
  subgroups?: IGroup[],
  isActive: boolean
}

export interface IRole {
  id: number,
  name: string
}

interface ILoginPayload {
  email: string,
  password: string
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as IUser|null,
      layout: EMPTY_LAYOUT as string,
    }
  },
  actions: {
    async GET_USER() {
      try {
        const { data } = await http.get('me')
        this.user = data
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async LOGIN_USER(payload: ILoginPayload) {
      const { email, password } = payload
      try {
        const { data } = await http.post("login", { email, password })
        if(data?.accessToken && data?.refreshToken) {
          this.user = data?.user
          this.layout = DEFAULT_LAYOUT
          window.localStorage.setItem("@access-token", data?.accessToken)
          window.localStorage.setItem("@refresh-token", data?.refreshToken)
        }
        return data?.user
      } catch(err) {
        console.error(err)
        throw err
      }
    },
    LOGOUT_USER() {
      window.localStorage.removeItem('@access-token')
      window.localStorage.removeItem('@refresh-token')
      this.layout = EMPTY_LAYOUT
      this.user = null
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
