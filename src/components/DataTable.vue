<script setup lang="ts" generic="T extends { id: number }">
import type { TableColumn } from '../types/table'

const props = defineProps<{
  columns: TableColumn<T>[]
  data: T[]
}>()

const emit = defineEmits<{
  edit: [row: T]
  delete: [row: T]
  'row-click': [row: T]
}>()
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="String(column.key)">
          {{ column.label }}
        </th>

        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in data" :key="row.id" @click="emit('row-click', row)">
        <td v-for="column in columns" :key="String(column.key)">
          {{ row[column.key] }}
        </td>

        <td class="actions">
          <button class="edit-btn" @click.stop="emit('edit', row)">Edit</button>

          <button class="delete-btn" @click.stop="emit('delete', row)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.data-table thead th {
  background: #f8fafc;
  color: #334155;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table tbody td {
  padding: 16px;
  border-bottom: 1px solid #edf2f7;
  color: #1f2937;
  vertical-align: top;
}

.data-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.actions button {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.actions button:hover {
  transform: translateY(-1px);
}

.edit-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
