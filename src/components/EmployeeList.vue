<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EmployeeCard from '@/components/EmployeeCard.vue'
import { employeeService } from '@/services/employeeService'
import { getApiErrorMessage } from '@/utils/apiError'
import type { ApiEmployee, Employee } from '@/types/employee'

const employees = ref<Employee[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadEmployees() {
  loading.value = true
  error.value = null

  try {
    const response = await employeeService.getAll()
    employees.value = Array.isArray(response)
      ? response.map(fromApiEmployee)
      : response.data.map((employee) =>
          'company' in employee ? fromApiEmployee(employee) : employee,
        )
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

function fromApiEmployee(employee: ApiEmployee): Employee {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    designation: employee.company.catchPhrase,
    department: employee.company.name,
    experience: 0,
    status: 'active',
  }
}

async function deleteEmployee(id: number) {
  try {
    await employeeService.delete(id)
    employees.value = employees.value.filter((employee) => employee.id !== id)
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  }
}

onMounted(loadEmployees)
</script>

<template>
  <section>
    <h1>Employees</h1>

    <p v-if="loading" role="status">Loading employees...</p>

    <div v-else-if="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="loadEmployees">Retry</button>
    </div>

    <p v-else-if="employees.length === 0">No employees found.</p>

    <div v-else>
      <EmployeeCard
        v-for="employee in employees"
        :key="employee.id"
        :employee="employee"
        @delete="deleteEmployee"
      />
    </div>
  </section>
</template>
