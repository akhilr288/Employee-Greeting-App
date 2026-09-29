<script setup lang="ts">
import type { CartItem } from '../types/product'

defineProps<{
  cart: CartItem[]
  total: number
}>()

const emit = defineEmits<{
  increase: [item: CartItem]
  decrease: [item: CartItem]
  remove: [productId: number]
}>()
</script>

<template>
  <section class="section">
    <h2>Your Cart</h2>

    <div v-if="cart.length === 0" class="empty-cart">Your cart is empty.</div>

    <div v-else class="cart">
      <article v-for="item in cart" :key="item.id" class="cart-item">
        <h3>{{ item.name }}</h3>

        <p class="cart-price">${{ item.price.toFixed(2) }} each</p>

        <div class="quantity">
          <button :disabled="item.quantity === 1" @click="emit('decrease', item)">-</button>

          <span class="quantity-value">
            {{ item.quantity }}
          </span>

          <button @click="emit('increase', item)">+</button>
        </div>

        <p class="subtotal">Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}</p>

        <button class="btn-danger" @click="emit('remove', item.id)">Remove</button>
      </article>

      <div class="cart-total">
        <h3>Total</h3>

        <strong class="total-price"> ${{ total.toFixed(2) }} </strong>
      </div>
    </div>
  </section>
</template>
