<script setup lang="ts">
defineProps<{
  title: string
  employeeCount: number
}>()
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <span class="text-gray-600">{{ employeeCount }} Employees</span>
  </div>
</template>
