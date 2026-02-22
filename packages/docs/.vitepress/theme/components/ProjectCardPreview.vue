<script setup lang="ts">
const project = {
  name: 'Example Project',
  type: 'github',
  status: 'active',
  description: 'This is an example project showing how ProjectCard renders with all its components.',
  stack: ['TypeScript', 'React', 'Next.js'],
  stars: 1234,
  forks: 56,
  links: {
    github: 'https://github.com/example/project',
    live: 'https://example.com'
  }
}
</script>

<template>
  <div class="example-preview">
    <div data-folio-card>
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
      <div data-folio-card-stats>
        <span data-folio-stat="stars">{{ project.stars }} stars</span>
        <span data-folio-stat="forks">{{ project.forks }} forks</span>
      </div>
      <div :data-folio-status="true" :data-folio-status-value="project.status">
        {{ project.status }}
      </div>
      <div data-folio-card-links>
        <a :href="project.links.github" data-folio-link data-folio-link-type="github">GitHub</a>
        <a :href="project.links.live" data-folio-link data-folio-link-type="live">Live</a>
      </div>
    </div>
  </div>
</template>
