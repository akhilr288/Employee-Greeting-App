<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  },
)
</script>

<template>
  <p class="loading-state" role="status" aria-live="polite">{{ message }}</p>
</template>

<style scoped>
.loading-state {
  margin: 1rem 0;
}
</style>
