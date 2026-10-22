<script setup lang="ts">
import { useAppTheme, type AppTheme } from '@/composables/useAppTheme'

const { theme, setTheme } = useAppTheme()

const themes: { label: string; value: AppTheme }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'High Contrast', value: 'high-contrast' },
]
</script>

<template>
  <section class="theme-switcher">
    <h2>Choose a theme</h2>

    <div class="theme-options">
      <button
        v-for="option in themes"
        :key="option.value"
        type="button"
        :aria-pressed="theme === option.value"
        :class="{ selected: theme === option.value }"
        @click="setTheme(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <p>
      Current theme: <strong>{{ theme }}</strong>
    </p>
  </section>
</template>
