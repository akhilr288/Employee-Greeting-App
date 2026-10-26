<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'SkillsTab' })

const skills = ref([
  { name: 'Vue 3', selected: true },
  { name: 'React', selected: true },
  { name: 'Angular', selected: true },
  { name: 'Laravel', selected: false },
  { name: 'Next.js', selected: true },
])
</script>

<template>
  <section>
    <h2>Technical Skills</h2>

    <label v-for="skill in skills" :key="skill.name">
      <input v-model="skill.selected" type="checkbox" />
      {{ skill.name }}
    </label>

    <p>
      Selected skills:
      {{ skills.filter((skill) => skill.selected).length }}
    </p>
  </section>
</template>
