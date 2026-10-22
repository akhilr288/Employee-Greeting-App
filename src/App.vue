<script setup lang="ts">
import { watch } from 'vue'
import { provideAppTheme } from '@/composables/useAppTheme'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import ThemePreview from '@/components/ThemePreview.vue'

const { theme } = provideAppTheme()

watch(
  theme,
  (currentTheme) => {
    document.documentElement.dataset.theme = currentTheme
  },
  { immediate: true },
)
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <h1>Application Theme System</h1>
      <p>Day 18 — Advanced Composition API</p>
    </header>

    <ThemeSwitcher />

    <ThemePreview />
  </main>
</template>
