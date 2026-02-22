<script setup lang="ts">
const project = {
  name: 'Featured Project',
  type: 'github',
  status: 'shipped',
  background: 'This project represents the best work I have done. It combines everything I have learned about building production-ready applications.',
  stack: ['TypeScript', 'React', 'Next.js', 'Prisma', 'PostgreSQL'],
  stats: { stars: 5000, forks: 300 },
  links: {
    github: 'https://github.com/example/featured',
    live: 'https://featured.example.com'
  }
}
</script>

<template>
  <div class="example-preview">
    <div data-folio-featured>
      <h2>{{ project.name }}</h2>
      
      <div data-folio-view-section>
        <p>{{ project.background }}</p>
      </div>
      
      <div data-folio-view-section>
        <div data-folio-card-tags>
          <span v-for="tag in project.stack" :key="tag" data-folio-tag>{{ tag }}</span>
        </div>
      </div>
      
      <div data-folio-view-stats>
        <span data-folio-stat="stars">{{ project.stats.stars }} stars</span>
        <span data-folio-stat="forks">{{ project.stats.forks }} forks</span>
      </div>
      
      <div data-folio-view-links>
        <a :href="project.links.github" data-folio-link data-folio-link-type="github">GitHub</a>
        <a :href="project.links.live" data-folio-link data-folio-link-type="live">Live</a>
      </div>
    </div>
  </div>
</template>
