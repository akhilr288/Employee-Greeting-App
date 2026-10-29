<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
    retryLabel?: string
    disabled?: boolean
  }>(),
  {
    retryLabel: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <p>{{ message }}</p>
    <button v-if="retryLabel" type="button" :disabled="disabled" @click="emit('retry')">
      {{ retryLabel }}
    </button>
  </div>
</template>

<style scoped>
.error-state {
  color: #a22;
}
</style>
