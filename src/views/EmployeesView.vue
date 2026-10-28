<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { employeeService } from '@/services/employeeService'
import { getApiErrorMessage } from '@/utils/apiError'
import type { ApiEmployee, EmployeeServiceResult } from '@/types/employee'

const employees = ref<ApiEmployee[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const companyFilter = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const page = ref(1)
const pageSize = 5

const filteredEmployees = computed(() => {
  const normalizedSearch = search.value.trim().toLocaleLowerCase()

  return employees.value
    .filter((employee) => employee.name.toLocaleLowerCase().includes(normalizedSearch))
    .filter((employee) => !companyFilter.value || employee.company.name === companyFilter.value)
    .slice()
    .sort((left, right) => {
      const comparison = left.name.localeCompare(right.name)
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)))
const visibleEmployees = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})
const companies = computed(() => [...new Set(employees.value.map(({ company }) => company.name))])

function resetPage() {
  page.value = 1
}

async function loadEmployees() {
  loading.value = true
  error.value = null

  try {
    const result: EmployeeServiceResult = await employeeService.getAll()
    if (Array.isArray(result)) {
      employees.value = result
    } else {
      employees.value = result.data.filter(
        (employee): employee is ApiEmployee => 'company' in employee,
      )
    }
  } catch (cause: unknown) {
    error.value = getApiErrorMessage(cause)
  } finally {
    loading.value = false
  }
}

onMounted(loadEmployees)
</script>

<template>
  <main>
    <h1>Employees</h1>
    <p v-if="loading" role="status">Loading employees...</p>
    <div v-else-if="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="loadEmployees">Retry</button>
    </div>
    <template v-else>
      <label>
        Search
        <input
          v-model="search"
          aria-label="Search employees by name"
          @input="resetPage"
        />
      </label>
      <label>
        Sort
        <select v-model="sortDirection" aria-label="Sort by name" @change="resetPage">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
      <label>
        Company
        <select v-model="companyFilter" aria-label="Filter by company" @change="resetPage">
          <option value="">All companies</option>
          <option v-for="company in companies" :key="company" :value="company">
            {{ company }}
          </option>
        </select>
      </label>

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Company</th></tr>
        </thead>
        <tbody>
          <tr v-for="employee in visibleEmployees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.company.name }}</td>
          </tr>
        </tbody>
      </table>

      <p>Page {{ page }} of {{ pageCount }}</p>
      <button
        type="button"
        aria-label="Previous page"
        :disabled="page <= 1"
        @click="page--"
      >
        Previous
      </button>
      <button
        type="button"
        aria-label="Next page"
        :disabled="page >= pageCount"
        @click="page++"
      >
        Next
      </button>
    </template>
  </main>
</template>
