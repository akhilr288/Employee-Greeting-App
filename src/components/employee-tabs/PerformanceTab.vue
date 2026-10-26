<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'PerformanceTab' })

const rating = ref(4)
</script>

<template>
  <section>
    <h2>Performance Review</h2>
    <p>Review period: Q3</p>

    <label for="rating">Rating: {{ rating }} / 5</label>
    <input id="rating" v-model.number="rating" type="range" min="1" max="5" />
  </section>
</template>
