<script setup lang="ts">
import { ref } from "vue"
import Dropdown from "primevue/dropdown"
import Chart from "primevue/chart"
import CircleProgress from "vue3-circle-progress"
import "vue3-circle-progress/dist/circle-progress.css"

const chartData = ref({
  labels: ['08/23', '09/23', '10/23', '11/23'],
  datasets: [
    {
      label: 'Үлгерім',
      data: [40, 50, 80, 80],
      backgroundColor: ['#16A34A', '#F6C77D', '#6C5DD3', '#6C5DD3'],
      borderRadius: 20
    }
  ]
});
const chartOptions = ref({
  scales: {
    y: {
      beginAtZero: true
    }
  }
});
</script>

<template>
  <h1 class="mb-6">Менің үлгерімім</h1>
  <div>
    <p class="text-lg">ҰБТ бойынша байқау тест баллдарының графигі</p>
    <Dropdown placeholder="Ай бойынша"/>
    <Chart type="bar" :height="80" :data="chartData" :options="chartOptions" />
  </div>
  <div class="mt-5">
    <p class="text-lg">Сабақтар бойынша бағалар</p>
    <div class="grid my-5">
      <div class="col-3">
        <div class="flex flex-column align-items-center shadow-2 border-round-2xl pb-5">
          <p class="text-lg font-medium">Математика</p>
          <div class="text-4xl font-bold">
            <CircleProgress
              size="150"
              :percent="82"
              show-percent
              border-bg-width="20"
              border-width="20"
              fill-color="#52CD9F"
            >50%</CircleProgress>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="flex flex-column align-items-center shadow-2 border-round-2xl pb-5">
          <p class="text-lg font-medium">Физика</p>
          <div class="text-4xl font-bold">
            <CircleProgress
              size="150"
              :percent="87"
              show-percent
              border-bg-width="20"
              border-width="20"
              fill-color="#FFE600"
            >50%</CircleProgress>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="flex flex-column align-items-center shadow-2 border-round-2xl pb-5">
          <p class="text-lg font-medium">География</p>
          <div class="text-4xl font-bold">
            <CircleProgress
              size="150"
              :percent="64"
              show-percent
              border-bg-width="20"
              border-width="20"
              fill-color="#6F8FAF"
            >50%</CircleProgress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
