<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useEmployee } from '../composables/useEmployee'
import { getApiErrorMessage } from '../utils/apiError'
import type { ApiEmployee, ApiEmployeePayload } from '../types/employee'

const {
  employees,
  loading,
  error: employeeError,
  fetchEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee: removeEmployee,
} = useEmployee()
const searchTerm = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const saving = ref(false)
const deletingId = ref<number | null>(null)
const formError = ref('')
const success = ref('')
const formVisible = ref(false)
const editingId = ref<number | null>(null)
const companyFilter = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const error = computed(() => formError.value || employeeError.value || '')

const companyOptions = computed(() =>
  [...new Set(employees.value.map((employee) => employee.company.name))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const filteredEmployees = computed(() => {
  const search = searchTerm.value.trim().toLocaleLowerCase()
  return employees.value
    .filter(
      (employee) =>
        employee.name.toLocaleLowerCase().includes(search) &&
        (!companyFilter.value || employee.company.name === companyFilter.value),
    )
    .sort((a, b) => {
      const result = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      return sortOrder.value === 'asc' ? result : -result
    })
})
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize.value)),
)
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredEmployees.value.slice(start, start + pageSize.value)
})

watch(searchTerm, () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

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
  formError.value = ''
  await fetchEmployees()
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
  formError.value = ''
  success.value = ''

  try {
    // Fetch the latest record before editing.
    const employee = await getEmployeeById(id)

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
    formError.value = getApiErrorMessage(err)
  }
}

async function submitForm() {
  formError.value = ''
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
    formError.value = 'Complete all required fields with valid values.'
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
      await updateEmployee(editingId.value, payload)
      success.value = 'Employee updated successfully.'
    } else {
      await addEmployee(payload)
      success.value = 'Employee created successfully.'
    }

    resetForm()
    await loadEmployees()
  } catch (err: unknown) {
    formError.value = getApiErrorMessage(err)
  } finally {
    saving.value = false
  }
}

async function deleteEmployee(employee: ApiEmployee) {
  const confirmed = window.confirm(`Delete ${employee.name}? This action cannot be undone.`)

  if (!confirmed) return

  formError.value = ''
  success.value = ''
  deletingId.value = employee.id

  try {
    await removeEmployee(employee.id)
    success.value = 'Employee deleted successfully.'
  } catch (err: unknown) {
    formError.value = getApiErrorMessage(err)
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

    <div v-if="error" class="api-error" role="alert">
      <p>{{ error }}</p>
      <button type="button" :disabled="loading" @click="loadEmployees">Retry</button>
    </div>

    <p v-if="success" class="success" role="status">
      {{ success }}
    </p>

    <div class="employee-list-controls">
      <label>
        Search by name
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search employees..."
          aria-label="Search employees by name"
        />
      </label>

      <label>
        Employees per page
        <select v-model.number="pageSize" aria-label="Employees per page">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </label>

      <label>
        Filter by company
        <select v-model="companyFilter" aria-label="Filter by company">
          <option value="">All companies</option>
          <option v-for="company in companyOptions" :key="company" :value="company">
            {{ company }}
          </option>
        </select>
      </label>

      <label>
        Sort by name
        <select v-model="sortOrder" aria-label="Sort by name">
          <option value="asc">A to Z</option>
          <option value="desc">Z to A</option>
        </select>
      </label>
    </div>

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

    <div v-if="loading" class="api-loading" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>Loading employees...</span>
    </div>

    <p v-else-if="!error && employees.length === 0">No employees found.</p>

    <p v-else-if="!error && filteredEmployees.length === 0">
      No employees match the current search and filters.
    </p>

    <div v-else-if="paginatedEmployees.length > 0" class="table-wrapper">
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
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
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

    <nav
      v-if="!loading && filteredEmployees.length > 0"
      class="employee-pagination"
      aria-label="Employee list pagination"
    >
      <span>
        Showing {{ (currentPage - 1) * pageSize + 1 }}–{{
          Math.min(currentPage * pageSize, filteredEmployees.length)
        }}
        of {{ filteredEmployees.length }}
      </span>

      <div>
        <button
          type="button"
          :disabled="currentPage === 1"
          aria-label="Previous page"
          @click="currentPage--"
        >
          Previous
        </button>
        <span aria-current="page">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          aria-label="Next page"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </nav>
  </section>
</template>
