<script setup lang="ts">
const projects = [
  {
    id: 'project-1',
    name: 'First Project',
    type: 'github',
    status: 'active',
    description: 'An active GitHub project.',
    stack: ['React', 'TypeScript']
  },
  {
    id: 'project-2',
    name: 'NPM Package',
    type: 'npm',
    status: 'shipped',
    description: 'A published npm package.',
    stack: ['TypeScript', 'Vitest']
  },
  {
    id: 'project-3',
    name: 'Work in Progress',
    type: 'manual',
    status: 'in-progress',
    description: 'A project currently in development.',
    stack: ['Next.js', 'Tailwind']
  }
]
</script>

<template>
  <div class="example-preview">
    <div data-folio-grid>
      <div v-for="project in projects" :key="project.id" data-folio-card>
        <div data-folio-card-header>
          <h3>{{ project.name }}</h3>
          <div :data-folio-type="true" :data-folio-type-value="project.type">
            {{ project.type }}
          </div>
        </div>
        <div data-folio-card-description>{{ project.description }}</div>
        <div data-folio-card-tags>
          <span v-for="tag in project.stack" :key="tag" data-folio-tag>{{ tag }}</span>
        </div>
        <div :data-folio-status="true" :data-folio-status-value="project.status">
          {{ project.status }}
        </div>
      </div>
    </div>
  </div>
</template>
