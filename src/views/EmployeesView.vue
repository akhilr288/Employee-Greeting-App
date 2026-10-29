<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import PaginationControls from '@/components/PaginationControls.vue'
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

watch(
  [searchTerm, companyFilter, pageSize, totalPages],
  ([search, company, size, pages], [previousSearch, previousCompany, previousSize]) => {
    if (search !== previousSearch || company !== previousCompany || size !== previousSize) {
      currentPage.value = 1
    } else if (currentPage.value > pages) {
      currentPage.value = pages
    }
  },
)

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
  <section class="employee-page">
    <header class="page-header">
      <div>
        <h1>Employees</h1>
        <p>Manage employee records.</p>
      </div>

      <button type="button" @click="startCreate">Add employee</button>
    </header>

    <ErrorState
      v-if="error"
      :message="error"
      retry-label="Retry"
      :disabled="loading"
      @retry="loadEmployees"
    />

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

    <LoadingState v-if="loading" message="Loading employees..." />

    <EmptyState v-else-if="!error && employees.length === 0" message="No employees found." />

    <EmptyState
      v-else-if="!error && filteredEmployees.length === 0"
      message="No employees match the current search and filters."
    />

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

    <PaginationControls
      v-if="!loading && filteredEmployees.length > 0"
      v-model:current-page="currentPage"
      :total-items="filteredEmployees.length"
      :page-size="pageSize"
      :total-pages="totalPages"
      label="Employee list pagination"
    />
  </section>
</template>

<style scoped>
.employee-page {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 64px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.page-header h1 {
  color: #172554;
  font-size: clamp(2rem, 4vw, 2.65rem);
  letter-spacing: -0.045em;
}

.page-header button,
.form-actions button[type='submit'] {
  border: 1px solid #1d4ed8;
  border-radius: 10px;
  padding: 11px 16px;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 7px 16px rgb(37 99 235 / 18%);
}

.page-header button:hover,
.form-actions button[type='submit']:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.employee-list-controls {
  display: grid;
  grid-template-columns: minmax(200px, 1.5fr) repeat(3, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
  padding: 18px;
  border: 1px solid #e4eaf3;
  border-radius: 16px;
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 8px 22px rgb(15 23 42 / 4%);
}

.employee-list-controls label,
.employee-form label {
  display: grid;
  gap: 7px;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
}

.employee-list-controls input,
.employee-list-controls select,
.employee-form input {
  min-width: 0;
  width: 100%;
  min-height: 42px;
  padding: 9px 11px;
  border: 1px solid #dbe3ee;
  border-radius: 9px;
  color: #1e293b;
  background: #fff;
  font-size: 0.9rem;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.employee-list-controls input:focus,
.employee-list-controls select:focus,
.employee-form input:focus {
  border-color: #60a5fa;
  outline: 0;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 13%);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e4eaf3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 28px rgb(15 23 42 / 5%);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #334155;
  font-size: 0.88rem;
}

th,
td {
  padding: 14px 15px;
  border-bottom: 1px solid #edf1f7;
  text-align: left;
  vertical-align: middle;
}

th {
  color: #64748b;
  background: #f8fafc;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

tbody tr {
  transition: background-color 140ms ease;
}

tbody tr:hover {
  background: #f8fbff;
}

tbody tr:last-child td {
  border-bottom: 0;
}

td:last-child {
  min-width: 180px;
  white-space: nowrap;
}

td a,
td button {
  margin-right: 7px;
}

td button {
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  padding: 7px 10px;
  color: #334155;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 650;
  cursor: pointer;
}

td button:hover:not(:disabled) {
  border-color: #bfdbfe;
  color: #1d4ed8;
  background: #eff6ff;
}

td button:last-child {
  border-color: #fee2e2;
  color: #b91c1c;
}

td button:last-child:hover:not(:disabled) {
  border-color: #fecaca;
  color: #991b1b;
  background: #fef2f2;
}

.employee-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  padding: 22px;
  border: 1px solid #dbeafe;
  border-radius: 16px;
  background: linear-gradient(145deg, #fff, #f8fbff);
  box-shadow: 0 12px 28px rgb(15 23 42 / 5%);
}

.employee-form h2,
.form-actions {
  grid-column: 1 / -1;
}

.employee-form h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.15rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button[type='button'] {
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  padding: 10px 15px;
  color: #475569;
  background: #fff;
  cursor: pointer;
}

.success {
  padding: 12px 14px;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  color: #166534;
  background: #f0fdf4;
}

.employee-page :deep(.empty-state),
.employee-page :deep(.loading-state) {
  padding: 28px 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  color: #64748b;
  background: rgb(255 255 255 / 75%);
  text-align: center;
}

.employee-page :deep(.error-state) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #991b1b;
  background: #fff7f7;
}

.employee-page :deep(.error-state p) {
  margin: 0;
}

.employee-page :deep(.error-state button) {
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  color: #991b1b;
  background: #fff;
  cursor: pointer;
}

@media (max-width: 900px) {
  .employee-list-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .employee-page {
    width: min(100% - 32px, 1200px);
    padding: 32px 0 48px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .employee-list-controls,
  .employee-form {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .employee-form h2,
  .form-actions {
    grid-column: auto;
  }

  .table-wrapper th,
  .table-wrapper td {
    padding: 12px;
    white-space: nowrap;
  }
}
</style>
