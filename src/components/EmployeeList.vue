<script setup lang="ts">
import DataTable from './DataTable.vue'
import type { TableColumn } from '../types/table'
import type { Employee } from '../types/employee'

const props = defineProps<{
  employees: Employee[]
}>()

const emit = defineEmits<{
  select: [employee: Employee]
}>()

const columns: TableColumn<Employee>[] = [
  { key: 'name', label: 'Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'department', label: 'Department' },
  { key: 'experience', label: 'Experience' },
  { key: 'status', label: 'Status' },
  { key: 'skills', label: 'Skills' },
]

function handleRowSelect(row: Employee) {
  emit('select', row)
}
</script>

<template>
  <section class="employee-list">
    <DataTable
      :columns="columns"
      :data="props.employees"
      @row-click="handleRowSelect"
      @edit="handleRowSelect"
      @delete="handleRowSelect"
    />
  </section>
</template>

<style scoped>
.employee-list {
  padding: 20px;
}
</style>
