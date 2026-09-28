<script setup lang="ts">
defineProps<{
  departments: string[]
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="filter">
    <label>Filter by Department</label>

    <select v-model="model">
      <option v-for="department in departments" :key="department" :value="department">
        {{ department }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filter {
  margin: 20px 0;
}

select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
}
</style>
