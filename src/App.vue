<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { watchEffect } from 'vue'
import EmployeeList from './components/EmployeeList.vue'
import SearchBar from './components/SearchBar.vue'
import { searchEmployees } from './services/employeeService'
import type { Employee } from './types/employee'

const searchKeyword = ref('')

const employees = ref<Employee[]>([])

const loading = ref(false)

const error = ref('')

let searchTimer: ReturnType<typeof setTimeout> | undefined

async function performSearch(keyword: string) {
  loading.value = true
  error.value = ''

  try {
    employees.value = await searchEmployees(keyword)
  } catch {
    error.value = 'Failed to search employees.'
  } finally {
    loading.value = false
  }
}

watch(searchKeyword, (keyword) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    performSearch(keyword)
  }, 300)
})

onUnmounted(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})

watchEffect(() => {
  console.log('Current search:', searchKeyword.value)
})
</script>

<template>
  <main class="container">
    <header class="page-header">
      <h1>Employee Search</h1>

      <p>Search employees using Vue watchers</p>
    </header>

    <SearchBar v-model="searchKeyword" />

    <div v-if="loading" class="loading">Searching...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="employees.length === 0" class="empty">No employees found.</div>

    <EmployeeList v-else :employees="employees" />
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
