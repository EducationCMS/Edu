<script setup lang="ts">
import { defineModel } from "vue"
import { useRouter } from "vue-router"

defineProps({
  teacherId: [Number, String],
  groups: Array
})
const emits = defineEmits(['close'])
const modelValue = defineModel<boolean>()

const router = useRouter()

const toGroupPage = (id: number) => {
  router.push({ name: 'AdminGroupDetail', params: { id } })
}
</script>

<template>
  <Dialog v-model:visible="modelValue" modal header="Классы" :style="{ width: '40vw' }" @after-hide="emits('close')">
    <div >
      <DataTable
          :value="groups || []"
          striped-rows
          table-class="border-1 border-solid border-300"
      >
        <template #empty>Классы не найдены</template>
        <Column field="name" header="Класс"></Column>
        <Column header="О классе">
          <template #body="slotProps">
            <Button
                size="small"
                class="bg-green-100 text-green-500"
                text
                icon="pi pi-eye"
                label="Подробнее"
                style="height: 36px"
                severity="success"
                @click="toGroupPage(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
</template>






<style scoped lang="scss">

</style>
