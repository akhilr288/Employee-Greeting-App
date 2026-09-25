<script setup lang="ts">
import SkillBadge from './SkillBadge.vue'

interface Employee {
  name: string
  designation: string
  department: string
  experience: number
  skills: string[]
  status: boolean
}

defineProps<{
  employee: Employee
}>()
</script>

<template>
  <div class="employee-card-wrapper">
    <div class="employee-card">
      <h2 class="employee-name">{{ employee.name }}</h2>
      <p class="employee-role">{{ employee.role }}</p>
      <div class="info-section">
        <p class="info-row">
          <span class="info-label">Designation:</span>
          <span class="info-value">{{ employee.designation }}</span>
        </p>
        <p class="info-row">
          <span class="info-label">Department:</span>
          <span class="info-value">{{ employee.department }}</span>
        </p>
        <p class="info-row">
          <span class="info-label">Experience:</span>
          <span class="info-value">{{ employee.experience }}</span>
        </p>
        <p class="info-row">
          <span class="info-label">Status:</span>
          <span class="status" :class="employee.status ? 'active' : 'inactive'">
            {{ employee.status ? 'Active' : 'Inactive' }}
          </span>
        </p>
      </div>
      <div class="skills-section">
        <h3 class="skills-title">Skills</h3>
        <div class="skills-list">
          <SkillBadge v-for="skill in employee.skills" :key="skill" :skill="skill" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-card-wrapper {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: Georgia, 'Times New Roman', serif;
}

.card-title {
  text-align: center;
  color: #4cbf8b;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 32px;
}

.employee-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.employee-name {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.employee-role {
  text-align: center;
  color: #4cbf8b;
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0 0 28px;
}

.info-section {
  margin-bottom: 24px;
}

.info-row {
  margin: 12px 0;
  font-size: 1rem;
}

.info-label {
  font-weight: 700;
  color: #1a1a1a;
  margin-right: 6px;
}

.info-value {
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
}

.status-badge.active {
  background-color: #1e7a1e;
}

.status-badge.inactive {
  background-color: #a33;
}

.skills-section {
  text-align: center;
  margin-top: 24px;
}

.skills-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
</style>
