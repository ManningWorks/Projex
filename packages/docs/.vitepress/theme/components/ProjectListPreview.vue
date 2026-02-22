<script setup lang="ts">
const projects = [
  {
    id: 'project-1',
    name: 'Shipped Product',
    type: 'github',
    status: 'shipped',
    description: 'A successfully shipped product with real users.',
    stars: 2000,
    forks: 150
  },
  {
    id: 'project-2',
    name: 'Legacy Project',
    type: 'manual',
    status: 'archived',
    description: 'An archived project that served its purpose.'
  }
]
</script>

<template>
  <div class="example-preview">
    <div data-folio-list>
      <div v-for="project in projects" :key="project.id" data-folio-card>
        <div data-folio-card-header>
          <h3>{{ project.name }}</h3>
          <div :data-folio-type="true" :data-folio-type-value="project.type">
            {{ project.type }}
          </div>
        </div>
        <div data-folio-card-description>{{ project.description }}</div>
        <div v-if="project.stars" data-folio-card-stats>
          <span data-folio-stat="stars">{{ project.stars }} stars</span>
          <span data-folio-stat="forks">{{ project.forks }} forks</span>
        </div>
        <div :data-folio-status="true" :data-folio-status-value="project.status">
          {{ project.status }}
        </div>
      </div>
    </div>
  </div>
</template>
