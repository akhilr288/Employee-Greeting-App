<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  submit: [
    expense: {
      title: string
      category: string
      amount: number
      date: string
    },
  ]
}>()

const form = reactive({
  title: '',
  category: '',
  amount: 0,
  date: '',
})

function submitForm() {
  if (!form.title.trim() || !form.category || form.amount <= 0 || !form.date) {
    return
  }

  emit('submit', {
    title: form.title,
    category: form.category,
    amount: form.amount,
    date: form.date,
  })

  form.title = ''
  form.category = ''
  form.amount = 0
  form.date = ''
}
</script>

<template>
  <form class="expense-form" @submit.prevent="submitForm">
    <div class="form-group">
      <label for="title"> Expense Title </label>

      <input id="title" v-model="form.title" type="text" placeholder="e.g. Lunch" />
    </div>

    <div class="form-group">
      <label for="category"> Category </label>

      <select id="category" v-model="form.category">
        <option value="">Select category</option>

        <option value="Food">Food</option>

        <option value="Transport">Transport</option>

        <option value="Shopping">Shopping</option>

        <option value="Bills">Bills</option>

        <option value="Entertainment">Entertainment</option>
      </select>
    </div>

    <div class="form-group">
      <label for="amount"> Amount </label>

      <input id="amount" v-model.number="form.amount" type="number" min="0" placeholder="0" />
    </div>

    <div class="form-group">
      <label for="date"> Date </label>

      <input id="date" v-model="form.date" type="date" />
    </div>

    <button type="submit">Add Expense</button>
  </form>
</template>
