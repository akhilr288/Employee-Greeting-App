<script setup lang="ts">
import EmployeeSalaryCard from './EmployeeSalaryCard.vue'

interface EmployeeSalary {
  id: number
  name: string
  designation: string
  basicSalary: number
  hra: number
  da: number
  bonus: number
  tax: number
  grossSalary: number
  taxAmount: number
  netSalary: number
}

defineProps<{
  employees: EmployeeSalary[]
}>()
</script>

<template>
  <section>
    <div class="section-header">
      <h2>Employees</h2>

      <span> {{ employees.length }} employees </span>
    </div>

    <div v-if="employees.length === 0" class="empty-state">No employees found.</div>

    <div v-else class="employee-list">
      <EmployeeSalaryCard v-for="employee in employees" :key="employee.id" :employee="employee" />
    </div>
  </section>
</template>
