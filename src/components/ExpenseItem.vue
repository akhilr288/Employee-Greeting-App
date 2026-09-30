<script setup lang="ts">
import type { Expense } from '../types/expense'

defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()
</script>

<template>
  <article class="expense-item">
    <div>
      <h3>{{ expense.title }}</h3>

      <p>
        {{ expense.category }} ·
        {{ expense.date }}
      </p>
    </div>

    <div class="expense-actions">
      <strong> ₹{{ expense.amount.toFixed(2) }} </strong>

      <button class="delete-button" @click="emit('delete', expense.id)">Delete</button>
    </div>
  </article>
</template>
