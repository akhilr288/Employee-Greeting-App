<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'TrainingTab' })

const completed = ref(false)
</script>

<template>
  <section>
    <h2>Training</h2>
    <p>Course: Advanced Vue 3 Composition API</p>
    <p>Status: {{ completed ? 'Completed' : 'In Progress' }}</p>

    <button type="button" @click="completed = !completed">
      {{ completed ? 'Mark Incomplete' : 'Mark Complete' }}
    </button>
  </section>
</template>
