<script setup lang="ts">
import EmployeeCard from './components/EmployeeCard.vue'

interface Employee {
  name: string
  designation: string
  department: string
  experience: number
  skills: string[]
  status: boolean
}

const employee: Employee = {
  name: 'Akhil R',
  designation: 'Software Engineer',
  department: 'Engineering',
  experience: 5,
  skills: ['Vue.js', 'React', 'Angular', 'TypeScript', 'Laravel', 'Tailwind CSS'],
  status: true,
}
</script>

<template>
  <main class="container">
    <h1>Employee Details</h1>
    <EmployeeCard :employee="employee" />
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #42b883;
}
</style>
