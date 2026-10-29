<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalItems: number
  pageSize: number
  totalPages: number
  label?: string
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const firstItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const lastItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

function changePage(page: number) {
  emit('update:currentPage', Math.min(Math.max(page, 1), props.totalPages))
}
</script>

<template>
  <nav class="pagination-controls" :aria-label="label ?? 'Pagination'">
    <span> Showing {{ firstItem }}–{{ lastItem }} of {{ totalItems }} </span>

    <div class="pagination-actions">
      <button
        type="button"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span aria-current="page">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  color: #64748b;
  font-size: 0.85rem;
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-actions span {
  min-width: 94px;
  color: #334155;
  font-weight: 700;
  text-align: center;
}

.pagination-actions button {
  border: 1px solid #dbe4f0;
  border-radius: 9px;
  padding: 8px 12px;
  color: #334155;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    color 140ms ease,
    background-color 140ms ease,
    border-color 140ms ease;
}

.pagination-actions button:hover:not(:disabled) {
  border-color: #bfdbfe;
  color: #1d4ed8;
  background: #eff6ff;
}

.pagination-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 640px) {
  .pagination-controls {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
