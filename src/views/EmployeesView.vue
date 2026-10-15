<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { employeeService } from '../services/employeeService'
import { getApiErrorMessage } from '../utils/apiError'
import type { ApiEmployee, ApiEmployeePayload } from '../types/employee'

const employees = ref<ApiEmployee[]>([])
const loading = ref(false)
const saving = ref(false)
const deletingId = ref<number | null>(null)
const error = ref('')
const success = ref('')
const formVisible = ref(false)
const editingId = ref<number | null>(null)

const emptyForm = (): ApiEmployeePayload => ({
  name: '',
  email: '',
  username: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
})

const form = reactive<ApiEmployeePayload>(emptyForm())

async function loadEmployees() {
  loading.value = true
  error.value = ''

  try {
    employees.value = await employeeService.getAll()
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
  formVisible.value = false
}

function startCreate() {
  resetForm()
  formVisible.value = true
}

async function startEdit(id: number) {
  error.value = ''
  success.value = ''

  try {
    // Fetch the latest record from GET /employees/:id.
    const employee = await employeeService.getById(id)

    Object.assign(form, {
      name: employee.name,
      email: employee.email,
      username: employee.username,
      address: { ...employee.address, geo: { ...employee.address.geo } },
      phone: employee.phone,
      website: employee.website,
      company: { ...employee.company },
    })

    editingId.value = employee.id
    formVisible.value = true
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  }
}

async function submitForm() {
  error.value = ''
  success.value = ''

  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.username.trim() ||
    !form.address.street.trim() ||
    !form.address.suite.trim() ||
    !form.address.city.trim() ||
    !form.address.zipcode.trim() ||
    !form.phone.trim() ||
    !form.website.trim() ||
    !form.company.name.trim() ||
    !form.company.catchPhrase.trim() ||
    !form.company.bs.trim()
  ) {
    error.value = 'Complete all required fields with valid values.'
    return
  }

  saving.value = true

  const payload: ApiEmployeePayload = {
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    username: form.username.trim(),
    address: {
      ...form.address,
      street: form.address.street.trim(),
      suite: form.address.suite.trim(),
      city: form.address.city.trim(),
      zipcode: form.address.zipcode.trim(),
    },
    phone: form.phone.trim(),
    website: form.website.trim(),
    company: {
      name: form.company.name.trim(),
      catchPhrase: form.company.catchPhrase.trim(),
      bs: form.company.bs.trim(),
    },
  }

  try {
    if (editingId.value !== null) {
      await employeeService.update(editingId.value, payload)
      success.value = 'Employee updated successfully.'
    } else {
      await employeeService.create(payload)
      success.value = 'Employee created successfully.'
    }

    resetForm()
    await loadEmployees()
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  } finally {
    saving.value = false
  }
}

async function deleteEmployee(employee: ApiEmployee) {
  const confirmed = window.confirm(`Delete ${employee.name}? This action cannot be undone.`)

  if (!confirmed) return

  error.value = ''
  success.value = ''
  deletingId.value = employee.id

  try {
    await employeeService.delete(employee.id)
    employees.value = employees.value.filter((item) => item.id !== employee.id)
    success.value = 'Employee deleted successfully.'
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err)
  } finally {
    deletingId.value = null
  }
}

onMounted(loadEmployees)
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h1>Employees</h1>
        <p>Manage employee records.</p>
      </div>

      <button type="button" @click="startCreate">Add employee</button>
    </header>

    <p v-if="error" class="error" role="alert">
      {{ error }}
    </p>

    <p v-if="success" class="success" role="status">
      {{ success }}
    </p>

    <form v-if="formVisible" class="employee-form" @submit.prevent="submitForm">
      <h2>{{ editingId === null ? 'Add employee' : 'Edit employee' }}</h2>

      <label>
        Name
        <input v-model.trim="form.name" required />
      </label>

      <label>
        Email
        <input v-model.trim="form.email" type="email" required />
      </label>

      <label>
        Username
        <input v-model.trim="form.username" required />
      </label>

      <label>
        Street
        <input v-model.trim="form.address.street" required />
      </label>

      <label>
        Suite
        <input v-model.trim="form.address.suite" required />
      </label>

      <label>
        City
        <input v-model.trim="form.address.city" required />
      </label>

      <label>
        ZIP code
        <input v-model.trim="form.address.zipcode" required />
      </label>

      <label>
        Phone
        <input v-model.trim="form.phone" type="tel" required />
      </label>

      <label>
        Website
        <input v-model.trim="form.website" type="url" required />
      </label>

      <label>
        Company
        <input v-model.trim="form.company.name" required />
      </label>

      <label>
        Company catch phrase
        <input v-model.trim="form.company.catchPhrase" required />
      </label>

      <label>
        Company business
        <input v-model.trim="form.company.bs" required />
      </label>

      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save employee' }}
        </button>

        <button type="button" :disabled="saving" @click="resetForm">Cancel</button>
      </div>
    </form>

    <p v-if="loading">Loading employees...</p>

    <p v-else-if="!error && employees.length === 0">No employees found.</p>

    <div v-else-if="employees.length > 0" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Companies</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.username }}</td>
            <td>
              {{ employee.address.street }}, {{ employee.address.suite }},
              {{ employee.address.city }} {{ employee.address.zipcode }}
            </td>
            <td>{{ employee.phone }}</td>
            <td>{{ employee.company.name }}</td>
            <td>
              <RouterLink
                :to="{
                  name: 'employee-details',
                  params: { id: employee.id },
                }"
              >
                View
              </RouterLink>

              <button
                type="button"
                :disabled="saving || deletingId !== null"
                @click="startEdit(employee.id)"
              >
                Edit
              </button>

              <button
                type="button"
                :disabled="deletingId === employee.id || saving"
                @click="deleteEmployee(employee)"
              >
                {{ deletingId === employee.id ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
