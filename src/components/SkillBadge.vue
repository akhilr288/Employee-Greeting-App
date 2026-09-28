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
  background: #dcfce7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}
</style>
