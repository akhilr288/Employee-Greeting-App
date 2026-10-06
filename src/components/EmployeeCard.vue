<script setup lang="ts">
import type { Employee } from '@/types/employee'

defineProps<{
  employee: Employee
  title: string
  count: number
}>()

const emit = defineEmits<{
  select: [employee: Employee]
}>()
</script>

<template>
  <article class="employee-card">
    <div>
      <h3>{{ employee.name }}</h3>

      <p>{{ employee.designation }}</p>

      <span>{{ employee.department }}</span>
    </div>

    <span :class="['status', employee.status === 'active' ? 'status-active' : 'status-inactive']">
      {{ employee.status }}
    </span>

    <button @click="emit('select', employee)">View Details</button>
  </article>
</template>
