import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 799,
      description: 'Ergonomic wireless mouse',
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 2499,
      description: 'Mechanical keyboard for developers',
    },
    {
      id: 3,
      name: 'USB-C Hub',
      price: 1299,
      description: 'Multi-port USB-C hub',
    },
    {
      id: 4,
      name: 'Laptop Stand',
      price: 999,
      description: 'Adjustable aluminum laptop stand',
    },
  ])

  function getProductById(id: number) {
    return products.value.find((product) => product.id === id)
  }

  return {
    products,
    getProductById,
  }
})
