<script setup lang="ts">
import { computed, ref } from "vue"

const emits = defineEmits(['remove'])
const props = defineProps(['name', 'image'])

const is_error = ref(false)
const imageUrl = computed(() => !is_error.value ? props.image : undefined)
</script>

<template>
<div class="selected-user-chip flex align-items-center bg-gray-100 pr-3 align-self-baseline">
  <Avatar
    :image="imageUrl"
    alt="name"
    size="large"
    shape="circle"
    class="mr-2"
    @error="is_error = true"
  />
<!--  <img-->
<!--    :src="image"-->
<!--    alt="Image"-->
<!--    class="selected-user-chip__avatar mr-2"-->
<!--    @error="defaultImage"-->
<!--  />-->
  <span class="font-semibold text-base mr-4">{{ name }}</span>
  <i class="pi pi-times cursor-pointer" @click="emits('remove')"></i>
</div>
</template>

<style scoped lang="scss">
.selected-user-chip {
  border-radius: 1000px;
}
</style>
