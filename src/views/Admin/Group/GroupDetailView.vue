<script setup lang="ts">
import http from "@/plugins/axios"
import { computed, onMounted, reactive, ref } from "vue"
import type { IUser } from "@/stores/user"
import type { ICourse } from "@/views/Admin/Course/CourseListView.vue"
import SelectedUserChip from "@/components/Admin/SelectedUserChip"
import { getImageUrl } from "@/helpers/getters"
import { stringToDate, stringToTime } from "@/helpers/date_formatters"

const props = defineProps(['id'])

const COURSE_DATA: IGroupSubject = {
  subject: null,
  teacher: null,
  schedule: {
    period: [],
    periodStart: '',
    periodEnd: '',
    times: [
      {
        dayOfWeek: '',
        timeModel: '',
        time: ''
      }
    ]
  }
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

interface IScheduleTime {
  id?: number,
  dayOfWeek: string,
  time: string,
  timeModel?: string
}
interface ISchedule {
  id?: number,
  period?: Date[],
  periodEnd: string,
  periodStart: string,
  times: IScheduleTime[]
}
interface IGroupSubject {
  subject: ICourse,
  teacher: IUser|null,
  schedule: ISchedule
}

export interface IGroup {
  id?: number,
  name: string,
  students: IUser[],
  subjectTeachers: IGroupSubject[],
  supervisor: IUser|null
}

const group_data = reactive<IGroup>({
  id: 0,
  name: '',
  students: [],
  subjectTeachers: [],
  supervisor: null
})
const group_name = ref('')
const is_saving = ref(false)
const selected_manager = ref()
const search_student = ref('')
const students = ref<IUser[]>([])
const courses = ref<ICourse[]>([])
const managers = ref<IUser[]>([])
const teachers = ref<IUser[]>([])
const active_schedule_form = ref<string|number>(-1)

const getGroup = async() => {
  try {
    const { data } = await http.get(`admin/subgroups/${props.id}`)
    group_data.id = data?.id,
    group_name.value = data?.name
    group_data.name = data?.name
    group_data.students = data?.students ?? []
    group_data.supervisor = managers.value.find(manager => data?.supervisor.id === manager.id) ?? null
    group_data.subjectTeachers = (data?.subjectTeachers || []).map((subject: IGroupSubject) => {
      return {
        ...subject,
        subject: courses.value.find(course => course.id === subject.subject.id) ?? {},
        schedule: {
          ...subject.schedule,
          period: [
            stringToDate(subject.schedule.periodStart),
            stringToDate(subject.schedule.periodEnd)
          ],
          times: subject.schedule.times.map((time: IScheduleTime) => {
            return {
              ...time,
              timeModel: stringToTime(time.time)
            }
          })
        }
      }
    })
    // if(group_data.subjects?.[0]?.subject) {
    //   await getTeacherList(group_data.subjects[0].subject.id, 0)
    // }
  } catch(e) {
    console.error(e)
    throw e
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

const getManagerList = async() => {
  try {
    const { data } = await http.get(`admin/get-managers`)
    managers.value = data?.items || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getTeacherList = async(id: string|number|undefined) => {
  try {
    const { data } = await http.get(`admin/get-teachers-by-subject/${id}`)
    teachers.value = data || []
    Object.assign(group_data.subjectTeachers, group_data.subjectTeachers.map(subject => {
      if(subject.subject.id === id) {
        return {
          ...subject,
          teacher: teachers.value.find(teacher => teacher.id === subject.teacher?.id) ?? {}
        }
      } else return subject
    }))
    // group_data.subjectTeachers.map(subject => {
    //   if(subject.subject.id === id) {
    //     return {
    //       ...subject,
    //       teacher: teachers.value.find(teacher => teacher.id === subject.teacher?.id) ?? {}
    //     }
    //   } else return subject
    // })
  } catch(e) {
    console.error(e)
    throw e
  }
}

const suggested_students = computed(() => students.value.filter(student => !group_data.students.map(st => st.id).includes(student.id)))

const getCourseList = async() => {
  try {
    const { data } = await http.get('admin/subjects')
    courses.value = data || []
  } catch(e) {
    console.error(e)
    throw e
  }
}

const addStudent = ({ value }: { value: IUser }) => {
  group_data.students = [...group_data.students, value]
  search_student.value = ''
}

const removeStudent = (id: number) => {
  group_data.students = group_data.students.filter(student => student.id !== id)
}

const saveClass = async() => {
  is_saving.value = true
  try {
    await http.put("admin/subgroups", group_data)
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_saving.value = false
  }
}


const onCourseChange = ({ value }: { value: ICourse }, index: number) => {
  // getTeacherList(value.id)
  // active_schedule_form.value = index
  active_schedule_form.value = -1
  handleChevronClick(index, value.id)
}

const onDateChange = (dates: Date[], index: number) => {
  if(dates.length === 2) {
    group_data.subjectTeachers[index].schedule.periodStart = new Date(dates[0]).toLocaleDateString()
    group_data.subjectTeachers[index].schedule.periodEnd = new Date(dates[1]).toLocaleDateString()
  }
}

const onTimeChange = (date: Date, index: number, sIndex: number) => {
  group_data.subjectTeachers[index].schedule.times[sIndex].time = new Date(date).toLocaleTimeString()
}

const addCourse = () => {
  group_data.subjectTeachers = [...group_data.subjectTeachers, structuredClone(COURSE_DATA)]
}

const removeCourse = (index: number) => {
  group_data.subjectTeachers.splice(index, 1)
  teachers.value = []
  active_schedule_form.value = -1
}

const addSchedule = (index: number) => {
  group_data.subjectTeachers[index].schedule.times = [...group_data.subjectTeachers[index].schedule.times, { dayOfWeek: '', timeModel: '', time: '' }]
}

const removeScheduleTime = (index: number, timeIndex: number) => {
  group_data.subjectTeachers[index].schedule.times.splice(timeIndex, 1)
}

const handleChevronClick = (index: string|number, id?: number) => {
  if(active_schedule_form.value !== index) {
    active_schedule_form.value = index
    getTeacherList(id)
  } else {
    active_schedule_form.value = -1
    teachers.value = []
  }
}

onMounted(async() => {
  await getCourseList()
  await getManagerList()
  await getGroup()
})
</script>

<template>
  <h1>
    <router-link to="/admin/groups">Все классы</router-link>
    <span v-if="group_name">{{ ` > ${group_name}` }}</span>
  </h1>
  <div class="formgrid grid mt-5" style="max-width: 50rem">
    <div class="field col-6">
      <label for="first_name" class="font-semibold">Название класса</label>
      <InputText id="first_name" v-model="group_data.name" />
    </div>
    <div class="field col-12">
      <label for="select_student" class="font-semibold d">Студенты</label>
      <span class="p-input-icon-left">
          <i class="pi pi-search z-1" />
          <AutoComplete
            v-model="search_student"
            id="select_student"
            placeholder="Имена учеников"
            class="w-30rem"
            style="display: grid"
            input-class="pl-5"
            option-label="login"
            :suggestions="suggested_students"
            @item-select="addStudent"
            @complete="getStudentList"
          />
        </span>
    </div>
    <div v-if="group_data.students.length" class="field col-12">
      <div class="flex gap-4 flex-wrap">
        <SelectedUserChip
          v-for="student in group_data.students"
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
      <template v-if="group_data.subjectTeachers.length">
        <div
          v-for="(course, cIdx) in group_data.subjectTeachers"
          :key="`course_${cIdx}`"
          class="mb-3"
        >
          <div class="flex align-items-center justify-content-between">
            <div>
              <Button
                v-if="group_data.subjectTeachers.length > 1"
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
              <span v-if="course.subject" class="cursor-pointer" @click="handleChevronClick(cIdx, course.subject.id)">
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
              <p class="mt-0 text-lg font-semibold">Расписание уроков</p>
              <div class="formgrid grid">
                <div class="field col-5 mt-3">
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
                  <div class="flex align-items-center justify-content-between mb-2">
                    <span class="font-light">Время</span>
                    <Button label="+ Добавить" size="small" style=" height: 32px" aria-label="Добавить время" @click="addSchedule(cIdx)"/>
                  </div>
                  <div
                    v-for="(schedule, sIdx) in course.schedule.times"
                    :key="`course_${cIdx}_schedule_${sIdx}`"
                    class="mb-2"
                  >
                    <div class="flex align-items-center gap-3">
                      <Calendar
                        v-model="schedule.timeModel"
                        time-only
                        class="w-10rem"
                        placeholder="Начало"
                        @update:modelValue="onTimeChange($event, cIdx, sIdx)"
                      />
                      <Dropdown v-model="schedule.dayOfWeek" class="flex-1" :options="WEEKDAYS" option-label="name" option-value="code" placeholder="День недели" />
                      <i class="pi pi-times cursor-pointer" @click="removeScheduleTime(cIdx, sIdx)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="field col-6">
      <label for="select_supervisor" class="font-semibold">Куратор</label>
      <Dropdown
        id="select_supervisor"
        v-model="group_data.supervisor"
        :options="managers"
        option-label="login"
        placeholder="Куратор"
        class="mr-3 w-20rem"
      />
    </div>
    <div class="field col-12 flex justify-content-end mt-5">
      <Button
        label="Сохранить"
        :loading="is_saving"
        @click="saveClass"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
