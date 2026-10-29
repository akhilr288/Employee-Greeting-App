<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <p class="empty-state">{{ message }}</p>
</template>

<style scoped>
.empty-state {
  margin: 1rem 0;
}
</style>
