<script setup lang="ts">
import { computed, ref } from 'vue'
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import { products, cartItems } from './constants/productdata'
import type { CartItem, Product } from './types/product'

const cart = ref<CartItem[]>(cartItems)

function addToCart(product: Product) {
  const existingItem = cart.value.find((item) => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
    return
  }

  cart.value.push({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  })
}

function increaseQuantity(item: CartItem) {
  item.quantity++
}

function decreaseQuantity(item: CartItem) {
  if (item.quantity > 1) {
    item.quantity--
  }
}

function removeFromCart(productId: number) {
  cart.value = cart.value.filter((item) => item.id !== productId)
}

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})
</script>

<template>
  <main class="container">
    <header class="page-header">
      <h1>Shopping Cart</h1>
    </header>

    <div class="shop-layout">
      <ProductList :products="products" @add-to-cart="addToCart" />

      <ShoppingCart
        :cart="cart"
        :total="cartTotal"
        @increase="increaseQuantity"
        @decrease="decreaseQuantity"
        @remove="removeFromCart"
      />
    </div>
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

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
