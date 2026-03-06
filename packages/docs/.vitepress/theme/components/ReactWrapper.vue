<script setup lang="ts">
import { createRoot, Root } from 'react-dom/client'
import { onMounted, onUnmounted, ref } from 'vue'
import { FullPortfolioExample } from './examples/full-portfolio'
import { FilteredGridExample } from './examples/filtered-grid'
import { SearchableListExample } from './examples/searchable-list'
import { InteractiveDemoExample } from './examples/interactive-demo'
import type { ComponentType } from 'react'

const props = defineProps<{
  component?: ComponentType<any>
  name?: 'FullPortfolioExample' | 'FilteredGridExample' | 'SearchableListExample' | 'InteractiveDemoExample'
  [key: string]: any
}>()

const containerRef = ref<HTMLDivElement>()
let root: Root | null = null

const renderReact = () => {
  if (!containerRef.value) return

  if (root) {
    root.unmount()
  }

  root = createRoot(containerRef.value)

  const component = props.component || (props.name ? {
    FullPortfolioExample,
    FilteredGridExample,
    SearchableListExample,
    InteractiveDemoExample
  }[props.name] : null)

  if (!component) return

  const reactElement = component(props)
  root.render(reactElement)
}

onMounted(() => {
  renderReact()
})

onUnmounted(() => {
  root?.unmount()
})
</script>

<template>
  <ClientOnly>
    <div ref="containerRef" />
  </ClientOnly>
</template>

