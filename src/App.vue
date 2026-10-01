<script setup lang="ts">
import { computed, ref } from 'vue'
import EmployeeList from './components/EmployeeList.vue'
import SalarySummary from './components/SalarySummary.vue'
import { employees } from './constants/employeeData'

const salaryFilter = ref('all')
const employeesWithSalary = computed(() => {
  return employees.map((employee) => {
    const grossSalary = employee.basicSalary + employee.hra + employee.da + employee.bonus

    const taxAmount = grossSalary * (employee.tax / 100)

    const netSalary = grossSalary - taxAmount

    return {
      ...employee,
      grossSalary,
      taxAmount,
      netSalary,
    }
  })
})
const filteredEmployees = computed(() => {
  const data = employeesWithSalary.value

  if (salaryFilter.value === 'below50000') {
    return data.filter((employee) => employee.netSalary < 50000)
  }

  if (salaryFilter.value === '50000to75000') {
    return data.filter((employee) => employee.netSalary >= 50000 && employee.netSalary <= 75000)
  }

  if (salaryFilter.value === 'above75000') {
    return data.filter((employee) => employee.netSalary > 75000)
  }

  return data
})

const highestSalary = computed(() => {
  if (employeesWithSalary.value.length === 0) {
    return 0
  }

  return Math.max(...employeesWithSalary.value.map((employee) => employee.netSalary))
})

const averageSalary = computed(() => {
  if (employeesWithSalary.value.length === 0) {
    return 0
  }

  const total = employeesWithSalary.value.reduce((sum, employee) => sum + employee.netSalary, 0)

  return total / employeesWithSalary.value.length
})
</script>

<template>
  <main class="container">
    <header class="page-header">
      <h1>Employee Salary Calculator</h1>

      <p>Salary analysis using Vue computed properties</p>
    </header>

    <SalarySummary
      :total-employees="employees.length"
      :highest-salary="highestSalary"
      :average-salary="averageSalary"
    />

    <section class="card">
      <div class="filter-bar">
        <label for="salary-filter"> Filter by net salary </label>

        <select id="salary-filter" v-model="salaryFilter">
          <option value="all">All Employees</option>

          <option value="below50000">Below ₹50,000</option>

          <option value="50000to75000">₹50,000 - ₹75,000</option>

          <option value="above75000">Above ₹75,000</option>
        </select>
      </div>
    </section>

    <EmployeeList :employees="filteredEmployees" />
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 30px;
}

h1 {
  text-align: center;
  color: #42b883;
}
</style>
