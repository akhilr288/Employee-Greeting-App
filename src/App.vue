<script setup lang="ts">
import { ref } from 'vue'
import CustomModal from './components/CustomModal.vue'
import type { Employee } from './types/employee'
import { employees } from './constants/employeeData'

const isModalOpen = ref(false)

const modalMode = ref<'add' | 'edit' | 'delete'>('add')

const selectedEmployee = ref<Employee | null>(null)
const employeeName = ref('')

function openAddModal() {
  modalMode.value = 'add'
  selectedEmployee.value = null
  employeeName.value = ''
  isModalOpen.value = true
}

function openEditModal(employee: Employee) {
  modalMode.value = 'edit'
  selectedEmployee.value = employee
  employeeName.value = employee.name
  isModalOpen.value = true
}

function openDeleteModal(employee: Employee) {
  modalMode.value = 'delete'
  selectedEmployee.value = employee
  isModalOpen.value = true
}

function handleConfirm() {
  if (modalMode.value === 'add') {
    if (!addEmployee()) return
  }

  if (modalMode.value === 'edit') {
    if (!updateEmployee()) return
  }

  if (modalMode.value === 'delete') {
    deleteEmployee()
  }

  isModalOpen.value = false
}

function handleCancel() {
  selectedEmployee.value = null
  employeeName.value = ''
  isModalOpen.value = false
}

function addEmployee(): boolean {
  const name = employeeName.value.trim()
  if (!name) return false

  employees.push({
    id: Math.max(0, ...employees.map((employee) => employee.id)) + 1,
    name,
    designation: 'New Employee',
    department: 'Engineering',
    experience: 0,
    status: 'active',
    skills: [],
    basicSalary: 0,
    hra: 0,
    da: 0,
    bonus: 0,
    tax: 0,
  })
  employeeName.value = ''
  return true
}

function updateEmployee(): boolean {
  const name = employeeName.value.trim()
  if (!selectedEmployee.value || !name) return false

  const employee = employees.find((item) => item.id === selectedEmployee.value?.id)

  if (!employee) return false

  employee.name = name
  return true
}

function deleteEmployee() {
  if (!selectedEmployee.value) {
    return
  }

  const index = employees.findIndex((employee) => employee.id === selectedEmployee.value?.id)
  if (index !== -1) employees.splice(index, 1)
  selectedEmployee.value = null
}
</script>

<template>
  <main class="employee-app">
    <header class="page-heading">
      <div>
        <p class="eyebrow">PEOPLE DIRECTORY</p>
        <h1>Employee management</h1>
        <p class="page-description">Manage your organization's employee records.</p>
      </div>
      <button class="button button-primary" type="button" @click="openAddModal">
        <span aria-hidden="true">+</span>
        Add employee
      </button>
    </header>

    <section class="employee-panel" aria-labelledby="employee-list-title">
      <div class="panel-heading">
        <div>
          <h2 id="employee-list-title">Employees</h2>
          <p>View and manage employee information.</p>
        </div>
        <span class="employee-count">{{ employees.length }} total</span>
      </div>

      <ul v-if="employees.length" class="employee-list">
        <li v-for="employee in employees" :key="employee.id" class="employee-row">
          <div class="employee-avatar" aria-hidden="true">
            {{ employee.name.charAt(0).toUpperCase() }}
          </div>
          <div class="employee-info">
            <span class="employee-name">{{ employee.name }}</span>
            <span class="employee-designation">{{ employee.designation }}</span>
          </div>
          <span class="employee-department">{{ employee.department }}</span>
          <span :class="['employee-status', `is-${employee.status}`]">
            <span class="status-dot" aria-hidden="true"></span>
            {{ employee.status }}
          </span>
          <div class="row-actions">
            <button
              class="button button-secondary"
              type="button"
              :aria-label="`Edit ${employee.name}`"
              @click="openEditModal(employee)"
            >
              Edit
            </button>
            <button
              class="button button-danger-quiet"
              type="button"
              :aria-label="`Delete ${employee.name}`"
              @click="openDeleteModal(employee)"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="empty-state">No employees yet. Add an employee to get started.</p>
    </section>

    <CustomModal
      v-if="modalMode === 'add'"
      v-model="isModalOpen"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #header>
        <h2>Add employee</h2>
      </template>

      <p class="modal-description">Add a new employee to the organization.</p>
      <label class="form-field">
        <span>Employee name</span>
        <input v-model="employeeName" autocomplete="name" autofocus required />
      </label>

      <template #footer>
        <button class="button button-secondary" type="button" @click="handleCancel">Cancel</button>
        <button
          class="button button-primary"
          type="button"
          :disabled="!employeeName.trim()"
          @click="handleConfirm"
        >
          Add employee
        </button>
      </template>
    </CustomModal>
    <CustomModal
      v-if="modalMode === 'edit'"
      v-model="isModalOpen"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #header>
        <h2>Edit employee</h2>
      </template>

      <label class="form-field">
        <span>Employee name</span>
        <input v-model="employeeName" autocomplete="name" required />
      </label>

      <template #footer>
        <button class="button button-secondary" type="button" @click="handleCancel">Cancel</button>
        <button
          class="button button-primary"
          type="button"
          :disabled="!employeeName.trim()"
          @click="handleConfirm"
        >
          Save changes
        </button>
      </template>
    </CustomModal>
    <CustomModal
      v-if="modalMode === 'delete'"
      v-model="isModalOpen"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #header>
        <h2>Delete employee</h2>
      </template>

      <p class="modal-description" v-if="selectedEmployee">
        Are you sure you want to delete <strong>{{ selectedEmployee.name }}</strong
        >? This action cannot be undone.
      </p>

      <template #footer>
        <button class="button button-secondary" type="button" @click="handleCancel">Cancel</button>
        <button class="button button-danger" type="button" @click="handleConfirm">
          Delete employee
        </button>
      </template>
    </CustomModal>
  </main>
</template>
