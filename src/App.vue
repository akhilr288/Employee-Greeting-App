<script setup lang="ts">
import { computed, ref } from 'vue'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import type { Expense } from './types/expense'

const expenses = ref<Expense[]>([])

function addExpense(expenseForm: Omit<Expense, 'id' | 'date'> & { date: string }) {
  if (
    !expenseForm.title.trim() ||
    !expenseForm.category ||
    expenseForm.amount <= 0 ||
    !expenseForm.date
  ) {
    return
  }

  const expense: Expense = {
    id: Date.now(),
    title: expenseForm.title,
    category: expenseForm.category,
    amount: expenseForm.amount,
    date: new Date(`${expenseForm.date}T00:00:00`),
  }

  expenses.value.push(expense)
}
function deleteExpense(id: number) {
  expenses.value = expenses.value.filter((expense) => expense.id !== id)
}
const totalExpense = computed(() => {
  return expenses.value.reduce((total, expense) => total + expense.amount, 0)
})
const categoryTotals = computed(() => {
  const totals: Record<string, number> = {}

  for (const expense of expenses.value) {
    if (!totals[expense.category]) {
      totals[expense.category] = 0
    }

    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount
  }

  return totals
})
</script>

<template>
  <main class="container">
    <header class="page-header">
      <h1>Expense Tracker</h1>
    </header>
    <ExpenseForm @submit="addExpense" />
    <section class="summary-grid">
      <div class="summary-card">
        <span>Total Expenses</span>

        <strong> ₹{{ totalExpense.toFixed(2) }} </strong>
      </div>

      <div class="summary-card">
        <span>Number of Expenses</span>

        <strong>
          {{ expenses.length }}
        </strong>
      </div>
    </section>
    <section class="category-section card">
      <h2>Category Summary</h2>

      <div v-if="Object.keys(categoryTotals).length === 0" class="empty-state">
        No category data yet.
      </div>

      <div v-else class="category-grid">
        <div v-for="(amount, category) in categoryTotals" :key="category" class="category-card">
          <span>{{ category }}</span>

          <strong> ₹{{ amount.toFixed(2) }} </strong>
        </div>
      </div>
    </section>
    <ExpenseList :expenses="expenses" @delete="deleteExpense" />
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 30px;
}

h1 {
  text-align: center;
  color: #42b883;
}
</style>
