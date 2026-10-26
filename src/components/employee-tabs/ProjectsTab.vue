<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'ProjectsTab' })

const projectNote = ref('')
</script>

<template>
  <section>
    <h2>Employee Projects</h2>
    <ul>
      <li>FairPal — Event management platform</li>
      <li>Brand-E — Quiz platform</li>
      <li>NAS Store — E-commerce configuration</li>
    </ul>

    <label for="project-note">Project notes</label>
    <textarea id="project-note" v-model="projectNote" placeholder="Write a project note..." />

    <p>Characters: {{ projectNote.length }}</p>
  </section>
</template>
