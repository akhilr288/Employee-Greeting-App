<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { employees } from '../constants/employeeData'

const route = useRoute()

const departmentFilter = computed(() => {
  const department = route.query.department
  return typeof department === 'string' ? department : ''
})

const filteredEmployees = computed(() => {
  if (!departmentFilter.value) return employees

  return employees.filter((employee) => employee.department === departmentFilter.value)
})
</script>

<template>
  <section>
    <h1>Employees</h1>

    <p>
      <RouterLink to="/employees">All departments</RouterLink>
      |
      <RouterLink :to="{ path: '/employees', query: { department: 'Engineering' } }">
        Engineering
      </RouterLink>
      |
      <RouterLink :to="{ path: '/employees', query: { department: 'Design' } }">
        Design
      </RouterLink>
    </p>

    <ul>
      <li v-for="employee in filteredEmployees" :key="employee.id">
        {{ employee.name }} — {{ employee.department }}

        <RouterLink :to="`/employees/${employee.id}`"> View details </RouterLink>
      </li>
    </ul>

    <p v-if="filteredEmployees.length === 0">No employees found.</p>
  </section>
</template>
