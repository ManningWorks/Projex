<template>
  <div class="component-preview">
    <div class="preview-container">
      <slot />
    </div>
    <div v-if="label" class="preview-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<style scoped>
.component-preview {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.preview-container {
  padding: 24px;
  background: var(--vp-c-bg);
}

.preview-label {
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
