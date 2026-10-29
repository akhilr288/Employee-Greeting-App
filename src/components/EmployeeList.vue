<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useEmployee } from '@/composables/useEmployee'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const { employees, loading, error, fetchEmployees, deleteEmployee } = useEmployee()
const currentPage = ref(1)
const pageSize = 5
const totalPages = computed(() => Math.max(1, Math.ceil(employees.value.length / pageSize)))
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return employees.value.slice(start, start + pageSize)
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

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
  <section class="employee-list-panel">
    <header class="list-header">
      <h2>Employees</h2>

      <button type="button" :disabled="loading" @click="fetchEmployees">Refresh</button>
    </header>

    <LoadingState v-if="loading" message="Loading employees..." />

    <ErrorState
      v-else-if="error"
      :message="error"
      retry-label="Try again"
      @retry="fetchEmployees"
    />

    <EmptyState v-else-if="employees.length === 0" message="No employees found." />

    <template v-else>
      <div class="table-wrapper">
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
            <tr v-for="employee in paginatedEmployees" :key="employee.id">
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

      <PaginationControls
        v-if="employees.length > pageSize"
        :current-page="currentPage"
        :total-items="employees.length"
        :page-size="pageSize"
        :total-pages="totalPages"
        label="Employee list pagination"
        @update:current-page="currentPage = $event"
      />
    </template>
  </section>
</template>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.list-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.2rem;
  letter-spacing: -0.025em;
}

.employee-list-panel {
  padding: 24px;
  border: 1px solid #e4eaf3;
  border-radius: 18px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 12px 32px rgb(15 23 42 / 5%);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e8edf5;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #334155;
  font-size: 0.9rem;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #edf1f7;
  text-align: left;
}

th {
  color: #64748b;
  background: #f8fafc;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr {
  transition: background-color 140ms ease;
}

tbody tr:hover {
  background: #f8fbff;
}

button {
  padding: 8px 12px;
  border: 1px solid #dbe4f0;
  border-radius: 9px;
  color: #334155;
  background: #fff;
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    color 140ms ease,
    background-color 140ms ease,
    border-color 140ms ease,
    transform 140ms ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: #bfdbfe;
  color: #1d4ed8;
  background: #eff6ff;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

td button {
  border-color: #fee2e2;
  color: #b91c1c;
}

td button:hover:not(:disabled) {
  border-color: #fecaca;
  color: #991b1b;
  background: #fef2f2;
}

@media (max-width: 640px) {
  .employee-list-panel {
    padding: 16px;
  }

  th,
  td {
    padding: 12px;
    white-space: nowrap;
  }
}
</style>
