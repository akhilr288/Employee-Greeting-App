<script setup lang="ts">
import type { Employee } from '@/types/employee'

defineProps<{
  employee: Employee
}>()

const emit = defineEmits<{
  edit: [employee: Employee]
  delete: [id: number]
}>()
</script>

<template>
  <article class="employee-card">
    <h2>{{ employee.name }}</h2>
    <p v-if="employee.email">{{ employee.email }}</p>
    <p>{{ employee.designation }} — {{ employee.department }}</p>

    <span
      :class="[
        'status',
        employee.status === true ? 'active' : employee.status === false ? 'inactive' : employee.status,
      ]"
    >
      {{ employee.status === true ? 'active' : employee.status === false ? 'inactive' : employee.status }}
    </span>

    <button type="button" @click="emit('edit', employee)">Edit</button>
    <button type="button" @click="emit('delete', employee.id)">Delete</button>
  </article>
</template>
