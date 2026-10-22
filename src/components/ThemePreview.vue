<script setup lang="ts">
import { useAppTheme } from '@/composables/useAppTheme'

const { theme } = useAppTheme()
</script>

<template>
  <section class="theme-preview">
    <h2>Theme Preview</h2>
    <p>This panel updates automatically when you change themes.</p>

    <p>
      Active theme: <strong>{{ theme }}</strong>
    </p>

    <button type="button">Sample Action</button>
  </section>
</template>
