<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { EmployeePayload } from '@/types/employee'

const emit = defineEmits<{
  submit: [payload: EmployeePayload]
  cancel: []
}>()

const form = reactive<EmployeePayload>({
  name: '',
  email: '',
  department: '',
  designation: '',
  experience: 0,
  status: 'active',
})

const errors = ref<Record<string, string>>({})

function validate(): boolean {
  const nextErrors: Record<string, string> = {}

  if (!form.name.trim()) {
    nextErrors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    nextErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    nextErrors.email = 'Enter a valid email address'
  }

  if (!form.department.trim()) {
    nextErrors.department = 'Department is required'
  }

  if (!form.designation.trim()) {
    nextErrors.designation = 'Designation is required'
  }

  if (!Number.isFinite(form.experience) || form.experience < 0) {
    nextErrors.experience = 'Experience must be zero or greater'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div>
      <label for="name">Name</label>
      <input id="name" v-model="form.name" />
      <p v-if="errors.name" role="alert">{{ errors.name }}</p>
    </div>

    <div>
      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" />
      <p v-if="errors.email" role="alert">{{ errors.email }}</p>
    </div>

    <div>
      <label for="department">Department</label>
      <input id="department" v-model="form.department" />
      <p v-if="errors.department" role="alert">
        {{ errors.department }}
      </p>
    </div>

    <div>
      <label for="designation">Designation</label>
      <input id="designation" v-model="form.designation" />
      <p v-if="errors.designation" role="alert">
        {{ errors.designation }}
      </p>
    </div>

    <div>
      <label for="experience">Experience (years)</label>
      <input id="experience" v-model.number="form.experience" type="number" min="0" />
      <p v-if="errors.experience" role="alert">
        {{ errors.experience }}
      </p>
    </div>

    <div>
      <label for="status">Status</label>
      <select id="status" v-model="form.status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <button type="submit">Save Employee</button>
    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>
