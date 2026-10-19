import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, Product } from '@/types/product'

export const useCartStore = defineStore('cart', () => {
  // STATE
  const items = ref<CartItem[]>([])

  // GETTERS
  const cartCount = computed(() => items.value.reduce((count, item) => count + item.quantity, 0))

  const cartTotal = computed(() =>
    items.value.reduce((total, item) => total + item.product.price * item.quantity, 0),
  )

  // ACTIONS
  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        product,
        quantity: 1,
      })
    }
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function increaseQuantity(productId: number) {
    const item = items.value.find((item) => item.product.id === productId)

    if (item) {
      item.quantity++
    }
  }

  function decreaseQuantity(productId: number) {
    const item = items.value.find((item) => item.product.id === productId)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeFromCart(productId)
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }
})
