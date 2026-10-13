<script setup lang="ts">
import AppSidebar from '../components/AppSidebar.vue'
</script>

<template>
  <div class="portal">
    <AppSidebar />

    <main class="portal-content">
      <RouterView />
    </main>
  </div>
</template>
