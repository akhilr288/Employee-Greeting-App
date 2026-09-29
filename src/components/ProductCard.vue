<script setup lang="ts">
import type { Product } from '../types/product'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()

function addToCart(product: Product) {
  emit('add-to-cart', product)
}
</script>

<template>
  <article class="product">
    <h3>{{ product.name }}</h3>

    <p class="product-price">${{ product.price.toFixed(2) }}</p>

    <button class="btn-primary" @click="addToCart(product)">Add to Cart</button>
  </article>
</template>
