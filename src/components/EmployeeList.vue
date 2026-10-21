<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployee } from '@/composables/useEmployee'

const { employees, loading, error, fetchEmployees, deleteEmployee } = useEmployee()

onMounted(() => {
  void fetchEmployees()
})

async function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this employee?')) {
    return
  }

  try {
    await deleteEmployee(id)
  } catch {
    // The composable already exposes a readable error message.
  }
}
</script>

<template>
  <section>
    <header class="list-header">
      <h2>Employees</h2>

      <button type="button" :disabled="loading" @click="fetchEmployees">Refresh</button>
    </header>

    <p v-if="loading" role="status">Loading employees...</p>

    <div v-if="error" class="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="fetchEmployees">Try again</button>
    </div>

    <p v-if="!loading && !error && employees.length === 0">No employees found.</p>

    <div v-if="employees.length" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.company.name }}</td>
            <td>{{ employee.phone }}</td>
            <td>
              <button type="button" @click="handleDelete(employee.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.error {
  color: #a22;
}
</style>
