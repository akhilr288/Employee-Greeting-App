<script setup lang="ts">
const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Employees', to: '/employees' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
]
</script>

<template>
  <aside class="sidebar">
    <h2>Employee Portal</h2>

    <nav aria-label="Main navigation">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        active-class="active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
