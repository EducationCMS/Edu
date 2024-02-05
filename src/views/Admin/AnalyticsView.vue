<script setup>
import Chart from "primevue/chart"
import { ref } from "vue"

const chartData = ref({
  labels: ['08/23', '09/23', '10/23', '11/23'],
  datasets: [
    {
      label: 'Сатылым',
      data: [40, 50, 20, 20],
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

const chartData1 = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Жалпы табыс',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderRadius: 20
    }
  ]
})
const chartData2 = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Жалпы кіріс',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderRadius: 20
    }
  ]
})
const chartData3 = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Таза пайда',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderRadius: 20
    }
  ]
})
</script>

<template>
  <div>
    <h1 class="font-semibold">Аналитика</h1>
    <div class="grid">
      <div class="col-3">
        <div class="border-1 border-gray-400 p-3 border-round-xl">
          <p class="mt-0 mb-2 font-semibold text-xl">322</p>
          <p class="my-0 text-gray-500 font-light">барлық сатылым саны</p>
        </div>
      </div>
      <div class="col-3">
        <div class="border-1 border-gray-400 p-3 border-round-xl">
          <p class="mt-0 mb-2 font-semibold text-xl">441</p>
          <p class="my-0 text-gray-500 font-light">платформадағы оқушылар саны</p>
        </div>
      </div>
      <div class="col-3">
        <div class="border-1 border-gray-400 p-3 border-round-xl">
          <p class="mt-0 mb-2 font-semibold text-xl">38</p>
          <p class="my-0 text-gray-500 font-light">платформадағы мұғалімдер саны</p>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <p>Сатылым графигі</p>
      <Chart type="bar" :height="80" :data="chartData" :options="chartOptions" />
    </div>
    <div class="grid gap-5 mt-7">
      <div class="col-5">
        <Chart type="bar" :height="40" :width="80" :data="chartData1" :options="chartOptions" />
      </div>
      <div class="col-5">
        <Chart type="bar" :height="40" :width="80" :data="chartData2" :options="chartOptions" />
      </div>
      <div class="col-5">
        <Chart type="bar" :height="40" :width="80" :data="chartData3" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
