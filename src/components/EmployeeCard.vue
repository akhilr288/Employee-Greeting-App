<script setup lang="ts">
import type { Employee } from '../types/employee'

defineProps<{
  employee: Employee
}>()
</script>

<template>
  <article class="employee-card">
    <h3>{{ employee.name }}</h3>
    <p>{{ employee.designation }}</p>
    <p>{{ employee.department }}</p>
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
