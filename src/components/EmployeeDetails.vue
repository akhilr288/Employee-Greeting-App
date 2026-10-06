<script setup lang="ts">
import type { Employee } from '../types/employee'

defineProps<{
  employee: Employee | null
}>()
</script>

<template>
  <section v-if="employee" class="employee-details">
    <h2>{{ employee.name }}</h2>

    <p>
      <strong>Designation:</strong>
      {{ employee.designation }}
    </p>

    <p>
      <strong>Department:</strong>
      {{ employee.department }}
    </p>

    <p>
      <strong>Experience:</strong>
      {{ employee.experience }} years
    </p>

    <h3>Skills</h3>

    <ul>
      <li v-for="skill in employee.skills" :key="skill">
        {{ skill }}
      </li>
    </ul>
  </section>

  <section v-else class="empty-state">Select an employee to view details.</section>
</template>
