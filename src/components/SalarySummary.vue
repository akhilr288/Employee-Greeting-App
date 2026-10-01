<script setup lang="ts">
defineProps<{
  totalEmployees: number
  highestSalary: number
  averageSalary: number
}>()
</script>

<template>
  <section class="summary-grid">
    <div class="summary-card">
      <span>Total Employees</span>

      <strong>
        {{ totalEmployees }}
      </strong>
    </div>

    <div class="summary-card">
      <span>Highest Net Salary</span>

      <strong> ₹{{ highestSalary.toLocaleString() }} </strong>
    </div>

    <div class="summary-card">
      <span>Average Net Salary</span>

      <strong> ₹{{ averageSalary.toLocaleString() }} </strong>
    </div>
  </section>
</template>
