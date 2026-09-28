<script setup lang="ts">
import { computed, ref } from 'vue'
import EmployeeCard from './components/EmployeeCard.vue'
import DepartmentFilter from './components/DepartmentFilter.vue'
import type { Employee } from './types/employee'

const selectedDepartment = ref('All')

const employees = ref<Employee[]>([
  {
    id: 1,
    name: 'Akhil R',
    designation: 'Software Engineer',
    department: 'Engineering',
    experience: 12,
    skills: ['Vue.js', 'React', 'Angular', 'TypeScript', 'Laravel', 'Tailwind CSS'],
    status: true,
  },
  {
    id: 2,
    name: 'Abhilash',
    designation: 'UI/UX Designer',
    department: 'Design',
    experience: 10,
    status: true,
    skills: ['Figma', 'Adobe XD', 'Illustrator'],
  },
  {
    id: 3,
    name: 'Nithin S',
    designation: 'Backend Developer',
    department: 'Engineering',
    experience: 7,
    status: false,
    skills: ['Laravel', 'MySQL', 'Redis'],
  },
  {
    id: 4,
    name: 'Asha',
    designation: 'QA Engineer',
    department: 'QA',
    experience: 2,
    status: true,
    skills: ['Cypress', 'Vitest', 'Playwright'],
  },
])

const departments = ['All', 'Engineering', 'Design', 'QA']

const filteredEmployees = computed(() => {
  if (selectedDepartment.value === 'All') {
    return employees.value
  }
  return employees.value.filter((employee) => employee.department === selectedDepartment.value)
})
</script>

<template>
  <main class="container">
    <h1>Employee Directory</h1>
    <DepartmentFilter :departments="departments" v-model="selectedDepartment" />
    <div class="employee-grid">
      <EmployeeCard v-for="employee in filteredEmployees" :key="employee.id" :employee="employee" />
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 30px;
}

h1 {
  text-align: center;
  color: #42b883;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
