<script setup lang="ts">
import { ref } from 'vue'
import EmployeeHeader from './components/EmployeeHeader.vue'
import EmployeeList from './components/EmployeeList.vue'
import EmployeeDetails from './components/EmployeeDetails.vue'
import EmployeeFooter from './components/EmployeeFooter.vue'
import type { Employee } from './types/employee'
import { employees } from './constants/employeeData'

const selectedEmployee = ref<Employee | null>(null)

function selectEmployee(employee: Employee) {
  selectedEmployee.value = employee
}
</script>

<template>
  <main class="container">
    <EmployeeHeader title="Employee Management" :employee-count="employees.length" />

    <div class="employee-layout">
      <EmployeeList :employees="employees" @select="selectEmployee" />

      <EmployeeDetails :employee="selectedEmployee" />
    </div>

    <EmployeeFooter :year="2026" />
  </main>
</template>
