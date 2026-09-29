<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '../types/product'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()
</script>

<template>
  <section class="section">
    <h2>Products</h2>

    <div class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="emit('add-to-cart', $event)"
      />
    </div>
  </section>
</template>
