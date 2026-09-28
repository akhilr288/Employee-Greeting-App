<script setup lang="ts">
import { computed } from 'vue'
import SkillBadge from './SkillBadge.vue'
import type { Employee } from '../types/employee'

const props = defineProps<{
  employee: Employee
}>()

const employeeLevel = computed(() => {
  const exp = props.employee.experience

  if (exp >= 5) {
    return { text: 'Senior Employee', class: 'senior' }
  }

  if (exp >= 3) {
    return { text: 'Mid-Level Employee', class: 'mid' }
  }

  return { text: 'Junior Employee', class: 'junior' }
})
</script>

<template>
  <article class="card">
    <h2>{{ employee.name }}</h2>

    <p class="designation">
      {{ employee.designation }}
    </p>

    <p>{{ employee.department }}</p>

    <p>{{ employee.experience }} Years Experience</p>

    <p class="level" :class="employeeLevel.class">
      {{ employeeLevel.text }}
    </p>

    <span class="status" :class="employee.status ? 'active' : 'inactive'">
      {{ employee.status ? 'Active' : 'Inactive' }}
    </span>

    <h4>Skills</h4>

    <div class="skills">
      <SkillBadge v-for="skill in employee.skills" :key="skill" :skill="skill" />
    </div>
  </article>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 90px;
  border-radius: 50%;
}

.designation {
  color: #42b883;
  font-weight: bold;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  margin: 10px 0;
}

.active {
  background: #16a34a;
}

.inactive {
  background: #dc2626;
}

.level {
  font-weight: bold;
}

.senior {
  color: #15803d;
}

.mid {
  color: #ea580c;
}

.junior {
  color: #2563eb;
}

button {
  margin-top: 15px;
}
</style>
