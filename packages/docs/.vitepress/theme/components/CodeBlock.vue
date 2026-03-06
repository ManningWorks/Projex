<template>
  <div class="code-block">
    <div class="code-header">
      <span v-if="language" class="language">{{ language }}</span>
      <button @click="copy" class="copy-button">
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre><code :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
  language?: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.code-block {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.language {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
}

.copy-button {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

code {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}
</style>
