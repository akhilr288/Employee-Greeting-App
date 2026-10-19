<script setup lang="ts">
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'

const productStore = useProductStore()
const cartStore = useCartStore()

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price)
}
</script>

<template>
  <main class="shopping-page">
    <header class="header">
      <h1>Shopping Store</h1>

      <div class="cart-summary">
        🛒 Cart ({{ cartStore.cartCount }})
        <strong>{{ formatPrice(cartStore.cartTotal) }}</strong>
      </div>
    </header>

    <section>
      <h2>Products</h2>

      <div class="product-grid">
        <article v-for="product in productStore.products" :key="product.id" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <strong>{{ formatPrice(product.price) }}</strong>

          <button type="button" @click="cartStore.addToCart(product)">Add to cart</button>
        </article>
      </div>
    </section>

    <section class="cart-section">
      <div class="section-header">
        <h2>Your Cart</h2>

        <button
          v-if="cartStore.items.length"
          type="button"
          class="secondary"
          @click="cartStore.clearCart()"
        >
          Clear cart
        </button>
      </div>

      <p v-if="cartStore.items.length === 0">Your cart is empty. Add a product to get started.</p>

      <article v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
        <div class="item-details">
          <strong>{{ item.product.name }}</strong>
          <span>{{ formatPrice(item.product.price) }} each</span>
          <span> Subtotal: {{ formatPrice(item.product.price * item.quantity) }} </span>
        </div>

        <div class="quantity-controls">
          <button
            type="button"
            :aria-label="`Decrease ${item.product.name} quantity`"
            @click="cartStore.decreaseQuantity(item.product.id)"
          >
            −
          </button>

          <span>{{ item.quantity }}</span>

          <button
            type="button"
            :aria-label="`Increase ${item.product.name} quantity`"
            @click="cartStore.increaseQuantity(item.product.id)"
          >
            +
          </button>
        </div>

        <button type="button" class="remove" @click="cartStore.removeFromCart(item.product.id)">
          Remove
        </button>
      </article>

      <div v-if="cartStore.items.length" class="total">
        <span>Total</span>
        <strong>{{ formatPrice(cartStore.cartTotal) }}</strong>
      </div>
    </section>
  </main>
</template>

<style scoped>
.shopping-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.header,
.section-header,
.cart-item,
.quantity-controls,
.total,
.cart-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header {
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.cart-summary {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
  margin: 16px 0 32px;
}

.product-card,
.cart-item {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.product-card p {
  color: #666;
  flex: 1;
}

button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
}

.product-card button {
  width: 100%;
}

.cart-section {
  margin-top: 32px;
}

.cart-item {
  margin-top: 12px;
  flex-wrap: wrap;
}

.item-details {
  display: grid;
  gap: 6px;
  flex: 1;
}

.item-details span {
  color: #666;
  font-size: 14px;
}

.quantity-controls {
  justify-content: center;
}

.quantity-controls button {
  min-width: 36px;
}

.secondary {
  background: #f5f5f5;
}

.remove {
  color: #a22;
}

.total {
  margin-top: 20px;
  padding: 16px 0;
  border-top: 1px solid #ddd;
  font-size: 20px;
}
</style>
