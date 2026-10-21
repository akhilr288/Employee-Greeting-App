<script setup lang="ts">
import EmployeeSummary from '@/components/EmployeeSummary.vue'
import EmployeeList from '@/components/EmployeeList.vue'
</script>

<template>
  <main class="employee-management">
    <h1>Employee Management</h1>

    <EmployeeSummary />
    <EmployeeList />
  </main>
</template>

<style scoped>
.employee-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
