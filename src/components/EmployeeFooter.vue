<script setup lang="ts">
defineProps<{
  year: number
}>()
</script>

<template>
  <footer class="employee-footer">
    <p>Employee Management System © {{ year }}</p>
  </footer>
</template>
