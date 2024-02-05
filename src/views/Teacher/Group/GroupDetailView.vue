<script setup lang="ts">
import { ref, watch } from "vue"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"
import http from "@/plugins/axios"
import { useRoute, useRouter } from "vue-router"
import InputNumber from "primevue/inputnumber"

interface ITask {
  name: string,
  description: string,
}

const props = defineProps({
  group_id: [String, Number],
  course_id: [String, Number],
  task_id: [String, Number]
})
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const task = ref<ITask>({
  name: '',
  description: ''
})
const group = ref()
const answers = ref([])
const is_loading = ref(true)

const getGroup = async() => {
  try {
    const { data } = await http.get(`subgroup/get-by-id/${props.group_id}`)
    group.value = data ?? {}
    // group.value = (data ?? []).find((group) => group.id == props.id)
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getTask = async() => {
  try {
    const { data } = await http.get(`task/get-by-id/${props.task_id}`)
    task.value = data ?? {}
    // group.value = (data ?? []).find((group) => group.id == props.id)
  } catch(e) {
    console.error(e)
    throw e
  }
}

const getTaskAnswerList = async() => {
  is_loading.value = true
  try {
    const { data } = await http.get(`task-answer/get-by-task-subgroup`, {
      params: {
        taskId: props.task_id,
        subgroupId: props.group_id
      }
    })
    console.log(data)
    answers.value = data || []
    // group.value = (data ?? []).find((group) => group.id == props.id)
  } catch(e) {
    console.error(e)
    throw e
  } finally {
    is_loading.value = false
  }
}

const handleScoreChange = async(score: number, answer_id: number) => {
  try {
    const { data } = await http.put(`task-answer/evaluate/${props.task_id}`, {
      score: score
    })
    console.log(data)
  } catch(e) {
    console.error(e)
    throw e
  }
}

const openDialog = () => {
  console.log()
}

watch(() => user.value, (user) => {
  if(user) {
    getGroup()
    getTask()
    getTaskAnswerList()
  }
}, { immediate: true })
</script>

<template>
  <h2 @click="router.go(-1)" class="cursor-pointer">{{ '< Барлық сыныптар' }}</h2>
  <div v-if="group" class="flex align-items-center my-6">
    <Avatar :label="group.name[0].toUpperCase()" size="xlarge" style="background-color:#4caf4f; color: #ffffff" />
    <p class="font-medium ml-4 text-xl">{{ group.name }}</p>
  </div>
  <div>
    <p class="mb-2 text-600">Тақырыбы</p>
    <p class="my-0 font-semibold">{{ task.name }}</p>
    <p class="mb-2 text-600">Тапсырма сипаттамасы</p>
    <p class="my-0 text-sm">{{ task.description }}</p>
  </div>
  <DataTable
    :value="answers || []"
    striped-rows
    table-class="border-1 border-solid border-300"
    :loading="is_loading"
    class="mt-5"
  >
    <template #empty>-</template>
    <Column field="name" header="Аты-жөні">
      <template #body="slotProps">
        <span>{{ slotProps.data.appUser.login }}</span>
      </template>
    </Column>
    <Column header="Тіркелген файлдар">
      <template #body="slotProps">
        <p>{{ slotProps.data.mediaFiles ? slotProps.data.mediaFiles.length : 'Тапсырмады' }}</p>
      </template>
    </Column>
    <Column header="Бағалау">
      <template #body="slotProps">
        <div class="flex align-items-center">
          <InputNumber
            v-model="slotProps.data.score"
            mode="decimal"
            class="mr-2"
            input-class="w-5rem"
            :min="0"
            :max="100"
            @blur="handleScoreChange($event.value, slotProps.data.id)"
          />
          /100
        </div>
      </template>
    </Column>
    <Column header="Толық көру">
      <template #body="slotProps">
        <Button
          size="small"
          class="bg-green-100 text-green-500"
          text
          icon="pi pi-eye"
          label="Толық көру"
          style="height: 36px"
          severity="success"
          @click="openDialog"
        />
      </template>
    </Column>
  </DataTable>
<!--  <div class="flex align-items-center justify-content-between">-->
<!--    <div class="w-30rem bg-primary-50 flex align-items-center border-2 border-primary border-round align-self-baseline p-1">-->
<!--      <Button label="Тапсырмалар" class="w-full" size="small" :text="active_tab !== 0" @click="active_tab = 0" />-->
<!--      <Button-->
<!--        label="Тақырыптар"-->
<!--        class="w-full"-->
<!--        size="small"-->
<!--        :text="active_tab !== 1"-->
<!--        @click="active_tab = 1"-->
<!--      />-->
<!--    </div>-->
<!--    <Button-->
<!--      v-if="active_tab === 0"-->
<!--      label="+ Жаңа тапсырма"-->
<!--      @click="dialog_visible = true"-->
<!--    />-->
<!--  </div>-->

</template>

<style scoped lang="scss">

</style>
