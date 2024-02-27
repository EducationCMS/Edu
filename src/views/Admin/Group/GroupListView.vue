<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue"
import http from "@/plugins/axios"
import SelectedUserChip from "@/components/Admin/SelectedUserChip.vue"
import type { ICourse } from "@/views/Admin/Course/CourseListView.vue"
import { getImageUrl } from "@/helpers/getters"
import type { IUser } from "@/stores/user"
import { useRouter } from "vue-router"
import Paginator, { type PageState } from "primevue/paginator"

const COURSE_DATA = {
  subject: null,
  teacher: null,
  schedule: {
    period: [],
    periodStart: '',
    periodEnd: '',
    times: [
      {
        dayOfWeek: null,
        timeModel: null,
        time: ''
      }
    ]
  }
}

const INITIAL_DATA = {
  name: "",
  students: [],
  courses: [structuredClone(COURSE_DATA)],
  supervisor: null,
  dates: [],
  time: '',
  weekday: ''
}

const WEEKDAYS = [
  { name: 'Понедельник', code: 'MONDAY' },
  { name: 'Вторник', code: 'TUESDAY' },
  { name: 'Среда', code: 'WEDNESDAY' },
  { name: 'Четверг', code: 'THURSDAY' },
  { name: 'Пятница', code: 'FRIDAY' },
  { name: 'Суббота', code: 'SATURDAY' },
  { name: 'Воскресенье', code: 'SUNDAY' }
]


const router = useRouter()

const is_loading = ref(false)
const delay_timer = ref<ReturnType<typeof setTimeout>>()
const page = ref(1)
const size = ref(10)
const search = ref("")
const search_student = ref('')
const search_course = ref('')
const search_manager = ref('')
const groups = ref([])
const groupsCount = ref(0)
const managers = ref([])
const selected_manager = ref<IUser>()
const students = ref([])
const selected_students = ref<IUser[]>()
const courses = ref([])
const selected_course = ref<ICourse>()
const teachers = ref([])
const selected_teacher = ref<IUser>()
const visible = ref(false)
const is_creating = ref(false)
const active_schedule_form = ref(-1)
const class_data = reactive({ ...INITIAL_DATA })

const filtered_students = computed(() => {
  return students.value.filter(student => !selected_students.value?.map(st => st.id).includes(student.id))
})

watch(() => search.value, () => {
  clearTimeout(delay_timer.value)
  delay_timer.value = setTimeout(() => {
    fetchGroups()
  }, 300)
})

const fetchGroups = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get("admin/subgroups", {
      params: {
        page: page.value,
        size: size.value,
        ...(search.value && { name: search.value })
      }
    })
    groups.value = data?.items || []
    groupsCount.value = data?.totalCount ?? 0
  } catch(err) {
    console.error(err)
    throw err
  } finally {
    is_loading.value = false
  }
}

const getTeacherList = async(id: string|number|undefined) => {
  try {
    const { data } = await http.get(`admin/get-teachers-by-subject/${id}`)
    teachers.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getManagerList = async() => {
  try {
    const { data } = await http.get(`admin/get-managers`)
    managers.value = data?.items || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const createClass = async() => {
  is_creating.value = true
  try {
    await http.post("admin/subgroups", {
      name: class_data.name,
      students: selected_students.value,
      supervisor: selected_manager.value,
      subjectTeachers: class_data.courses
      // subjectTeachers: [
      //   {
      //     subject: selected_course.value,
      //     teacher: selected_teacher.value,
      //     schedule: {
      //       periodStart: new Date(class_data.dates[0]).toLocaleDateString(),
      //       periodEnd: new Date(class_data.dates[1]).toLocaleDateString(),
      //       times: [
      //         {
      //           dayOfWeek: class_data.weekday,
      //           time: new Date(class_data.time).toLocaleTimeString()
      //         }
      //       ]
      //     }
      //   }
      // ]
    })
    await fetchGroups()
    visible.value = false
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_creating.value = false
  }
}

const getStudentList = async() => {
  try {
    const { data } = await http.get('get-students-without-subgroup', {
      params: {
        query: search_student.value
      }
    })
    students.value = data?.items || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getCourseList = async() => {
  try {
    const { data } = await http.get('admin/subjects')
    courses.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const onCourseChange = ({ value }: { value: ICourse }, index: number) => {
  getTeacherList(value.id)
  active_schedule_form.value = index
}

const onDateChange = (dates: Date[], index: number) => {
  if(dates.length === 2) {
    class_data.courses[index].schedule.periodStart = new Date(dates[0]).toLocaleDateString()
    class_data.courses[index].schedule.periodEnd = new Date(dates[1]).toLocaleDateString()
  }
}

const onTimeChange = (date: Date, index: number, sIndex: number) => {
  class_data.courses[index].schedule.times[sIndex].time = new Date(date).toLocaleTimeString()
}

const addCourse = () => {
  class_data.courses = [...class_data.courses, structuredClone(COURSE_DATA)]
  teachers.value = []
  active_schedule_form.value++
}

const removeCourse = (index: number) => {
  class_data.courses.splice(index, 1)
  teachers.value = []
  active_schedule_form.value = -1
}

const addSchedule = (index: number) => {
  class_data.courses[index].schedule.times = [...class_data.courses[index].schedule.times, { dayOfWeek: null, timeModel: null, time: '' }]
}

const addStudent = ({ value }: { value: IUser }) => {
  selected_students.value = [...(selected_students.value || []), value]
  search_student.value = ''
}

const removeStudent = (id: number) => {
  selected_students.value = (selected_students.value || []).filter(student => student.id !== id)
}

const onPageChange = (event: PageState) => {
  page.value = event.page + 1
  fetchGroups()
}

const toGroupPage = (id: number) => {
  router.push({ name: 'AdminGroupDetail', params: { id } })
}

onMounted(() => {
  fetchGroups()
  getCourseList()
  getManagerList()
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Добавить класс в платформу"
    :style="{ width: '70vw' }"
  >
    <div class="formgrid grid">
      <div class="field col-6">
        <label for="first_name" class="font-semibold">Название класса</label>
        <InputText id="first_name" v-model="class_data.name" />
      </div>
      <div class="field col-12">
        <label for="select_student" class="font-semibold d">Ученики</label>
        <span class="p-input-icon-left">
          <i class="pi pi-search z-1" />
          <AutoComplete
            v-model="search_student"
            id="select_student"
            placeholder="Имя студента"
            class="w-30rem"
            style="display: grid"
            input-class="pl-5"
            option-label="login"
            :suggestions="filtered_students"
            @item-select="addStudent"
            @complete="getStudentList"
          />
        </span>
      </div>
      <div v-if="selected_students && selected_students.length" class="field col-12">
        <div class="flex gap-4 flex-wrap">
          <SelectedUserChip
            v-for="student in selected_students"
            :key="student.id"
            :name="student.login"
            :image="getImageUrl(student.avatar)"
            @remove="removeStudent(student.id)"
          />
        </div>
      </div>
      <div class="field col-12">
        <div class="flex align-items-center justify-content-between">
          <p class="font-semibold">Курсы</p>
          <Button icon="pi pi-plus" rounded size="small" style="width: 40px; height: 40px" aria-label="Добавить курс" @click="addCourse"/>
        </div>
        <div
          v-for="(course, cIdx) in class_data.courses"
          :key="`course_${cIdx}`"
          class="mb-3"
        >
          <div class="flex align-items-center justify-content-between">
            <div>
              <Button
                v-if="class_data.courses.length > 1"
                severity="danger"
                outlined
                icon="pi pi-trash"
                class="mr-2"
                @click="removeCourse(cIdx)"
              />
              <Dropdown
                v-model="course.subject"
                :options="courses"
                optionLabel="name"
                placeholder="Название курса"
                class="mr-3 w-20rem"
                @change="onCourseChange($event, cIdx)"
              />
              <span class="cursor-pointer" @click="active_schedule_form = active_schedule_form !== cIdx ? cIdx : -1">
                <i :class="['pi', `pi-chevron-${active_schedule_form === cIdx ? 'up' : 'down'}`]"></i>
              </span>
            </div>
          </div>
          <div v-if="active_schedule_form === cIdx" class="formgrid grid p-4 border-round-md border-solid border-300 mt-3">
            <div class="field col-6">
              <label for="course_teacher" class="font-semibold">Учитель</label>
              <Dropdown
                id="course_teacher"
                v-model="course.teacher"
                :options="teachers"
                option-label="login"
                placeholder="Учитель"
                class="mr-3 w-20rem"
              />
            </div>
            <div class="px-2 w-full">
              <p class="mt-0 text-lg font-semibold">Расписание</p>
              <div class="formgrid grid">
                <div class="field col-5 mt-1">
                  <label for="course_period" class="font-light">Период</label>
                  <Calendar
                    v-model="course.schedule.period"
                    id="course_period"
                    date-format="yy-mm-dd"
                    selectionMode="range"
                    :manualInput="false"
                    hide-on-range-selection
                    class="w-full"
                    @update:modelValue="onDateChange($event, cIdx)"
                  />
                </div>
                <div class="field col-6 col-offset-1">
                  <div class="flex align-items-center justify-content-between">
                    <span class="font-light">Время</span>
                    <Button label="+ Добавить" size="small" style=" height: 32px" aria-label="Добавить время" @click="addSchedule(cIdx)"/>
                  </div>
                  <div
                    v-for="(schedule, sIdx) in course.schedule.times"
                    :key="`course_${cIdx}_schedule_${sIdx}`"
                    class="mb-2"
                  >
                    <div class="flex align-items-center gap-4">
                      <Calendar v-model="schedule.timeModel" time-only placeholder="Начало" @update:modelValue="onTimeChange($event, cIdx, sIdx)"/>
                      <Dropdown v-model="schedule.dayOfWeek" :options="WEEKDAYS" option-label="name" option-value="code" placeholder="Апта күні" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field col-6">
        <label for="select_supervisor" class="font-semibold">Куратор</label>
        <Dropdown
          id="select_supervisor"
          v-model="selected_manager"
          :options="managers"
          option-label="login"
          placeholder="Куратор"
          class="mr-3 w-20rem"
        />
      </div>
      <div class="field col-12 flex justify-content-end mt-5">
        <Button
          label="Сохранить"
          :loading="is_creating"
          @click="createClass"
        />
      </div>
    </div>
  </Dialog>
  <div>
    <h1 class="font-semibold">Классы</h1>
    <div class="flex justify-content-between align-items-center mt-5 mb-6">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Искать" />
      </span>
      <Button
        label="+ Добавить класс"
        @click="visible = true"
      />
    </div>
  </div>
  <div style="max-width: 50rem">
    <DataTable
      :value="groups"
      :loading="is_loading"
      striped-rows
      show-gridlines
    >
      <template #empty>
        <p class="text-gray-600 text-center">Классы не найдены</p>
      </template>
      <Column field="name" header="Класс"></Column>
      <Column field="supervisor.login" header="Куратор">
<!--        <template #body="slotProps">-->
<!--          {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}-->
<!--        </template>-->
      </Column>
      <Column header="Номер куратора">
        <template #body="slotProps">
          +7{{ slotProps.data.supervisor?.phoneNumber }}
        </template>
      </Column>
      <Column header="О классе">
        <template #body="slotProps">
          <Button
            size="small"
            class="bg-green-100 text-green-500"
            text
            icon="pi pi-eye"
            label="Посмотреть полностью"
            style="height: 36px"
            severity="success"
            @click="toGroupPage(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
      v-model="page"
      :rows="size"
      :total-records="groupsCount"
      @page="onPageChange"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
