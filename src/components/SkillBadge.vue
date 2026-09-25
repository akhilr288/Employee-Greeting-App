<script setup lang="ts">
defineProps<{
  skill: string
}>()
</script>

<template>
  <span class="badge">
    {{ skill }}
  </span>
</template>

<style scoped>
.badge {
  background: #e8fff5;
  color: #176b4d;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}
</style>
