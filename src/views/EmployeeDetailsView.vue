<script setup lang="ts">
import { ref, watch } from 'vue'
import { employeeService } from '../services/employeeService'
import { getApiErrorMessage } from '../utils/apiError'
import type { ApiEmployee } from '../types/employee'

const props = defineProps<{
  id: string | number
}>()

const employee = ref<ApiEmployee | null>(null)
const loading = ref(false)
const error = ref('')
let requestId = 0

async function loadEmployee(id: string | number) {
  const currentRequest = ++requestId
  const employeeId = Number(id)
  employee.value = null
  error.value = ''

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    error.value = 'The employee ID is invalid.'
    loading.value = false
    return
  }

  loading.value = true

  try {
    employee.value = await employeeService.getById(employeeId)
  } catch (err: unknown) {
    if (currentRequest === requestId) {
      error.value = getApiErrorMessage(err)
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false
    }
  }
}

watch(() => props.id, loadEmployee, { immediate: true })
</script>

<template>
  <section>
    <h1>Employee Details</h1>

    <p v-if="loading">Loading employee...</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>

    <template v-else-if="employee">
      <p><strong>ID:</strong> {{ employee.id }}</p>
      <p><strong>Name:</strong> {{ employee.name }}</p>
      <p><strong>Username:</strong> {{ employee.username }}</p>
      <p><strong>Email:</strong> {{ employee.email }}</p>
      <p>
        <strong>Address:</strong>
        {{ employee.address.street }}, {{ employee.address.suite }}, {{ employee.address.city }}
        {{ employee.address.zipcode }}
      </p>
      <p><strong>Phone:</strong> {{ employee.phone }}</p>
      <p><strong>Website:</strong> {{ employee.website }}</p>
      <p><strong>Company:</strong> {{ employee.company.name }}</p>
      <p><strong>Company catch phrase:</strong> {{ employee.company.catchPhrase }}</p>
      <p><strong>Company business:</strong> {{ employee.company.bs }}</p>
    </template>

    <RouterLink to="/employees">Back to employees</RouterLink>
  </section>
</template>
