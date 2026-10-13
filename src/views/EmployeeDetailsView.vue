<script setup lang="ts">
import { computed } from 'vue'
import { employees } from '../constants/employeeData'

const props = defineProps<{
  id: number
}>()

const employee = computed(() => employees.find((item) => item.id === Number(props.id)))
console.log('Employee:', employee.value?.name)
</script>

<template>
  <section>
    <h1>Employee Details</h1>

    <template v-if="employee">
      <p><strong>ID:</strong> {{ employee.id }}</p>
      <p><strong>Name:</strong> {{ employee.name }}</p>
      <p><strong>Department:</strong> {{ employee.department }}</p>
      <p><strong>Email:</strong> {{ employee.email }}</p>
      <p><strong>Phone:</strong> {{ employee.phone }}</p>
      <p><strong>Skills:</strong> {{ employee.skills.join(', ') }}</p>
      <p><strong>Experience:</strong> {{ employee.experience }} years</p>
      <p><strong>Joining Date:</strong> {{ employee.joiningDate }}</p>
      <p><strong>Status:</strong> {{ employee.status }}</p>
    </template>

    <p v-else>Employee not found.</p>

    <RouterLink to="/employees">Back to employees</RouterLink>
  </section>
</template>
