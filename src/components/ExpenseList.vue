<script setup lang="ts">
import ExpenseItem from './ExpenseItem.vue'
import type { Expense } from '../types/expense'

defineProps<{
  expenses: Expense[]
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()
</script>

<template>
  <section class="card">
    <div class="section-header">
      <h2>Expenses</h2>

      <span> {{ expenses.length }} expenses </span>
    </div>

    <p v-if="expenses.length === 0" class="empty-state">No expenses added yet.</p>

    <div v-else>
      <ExpenseItem
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>
