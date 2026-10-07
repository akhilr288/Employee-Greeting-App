<script setup lang="ts">
const isOpen = defineModel<boolean>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function close() {
  isOpen.value = false
}

function handleConfirm() {
  emit('confirm')
  close()
}

function handleCancel() {
  emit('cancel')
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="custom-modal-overlay" @click.self="handleCancel">
      <div class="custom-modal">
        <header class="custom-modal-header">
          <slot name="header">
            <h2>Modal</h2>
          </slot>

          <button class="custom-modal-close" type="button" @click="handleCancel">×</button>
        </header>

        <section class="custom-modal-body">
          <slot />
        </section>

        <footer class="custom-modal-footer">
          <slot name="footer">
            <button type="button" @click="handleCancel">Cancel</button>

            <button type="button" @click="handleConfirm">Confirm</button>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
