<script setup lang="ts">
import EmployeeCard from './EmployeeCard.vue'
import type { Employee } from '../types/employee'
defineProps<{
  employees: Employee[]
}>()
</script>

<template>
  <section>
    <EmployeeCard v-for="employee in employees" :key="employee.id" :employee="employee" />
  </section>
</template>
