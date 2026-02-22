<script setup lang="ts">
const project = {
  name: 'Detailed Project View',
  type: 'github',
  status: 'active',
  background: 'This project was born out of frustration with existing solutions. Every developer builds a projects page from scratch, and I got tired of solving the same problem repeatedly.',
  why: 'No existing solution handled the reality of a solopreneur project mix - private repos, client work, npm packages, and unreleased ideas all in one place.',
  stack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  struggles: [
    { type: 'warn', text: 'Deciding between npm package and shadcn-style distribution took longer than expected.' },
    { type: 'error', text: 'GitHub API rate limiting at 60req/hr unauthenticated is brutal.' }
  ],
  timeline: [
    { date: '2024-01-10', note: 'Initial concept and research' },
    { date: '2024-01-18', note: 'First working prototype' },
    { date: '2024-02-01', note: 'Beta release' }
  ],
  stats: { stars: 2500, forks: 180 },
  links: {
    github: 'https://github.com/example/detailed',
    live: 'https://detailed.example.com'
  }
}
</script>

<template>
  <div class="example-preview">
    <div data-folio-view>
      <h2>{{ project.name }}</h2>
      
      <div data-folio-view-section data-folio-view-section-name="background">
        <h4>Background</h4>
        <p>{{ project.background }}</p>
      </div>
      
      <div data-folio-view-section data-folio-view-section-name="why">
        <h4>Why</h4>
        <p>{{ project.why }}</p>
      </div>
      
      <div data-folio-view-section data-folio-view-section-name="stack">
        <h4>Stack</h4>
        <div data-folio-card-tags>
          <span v-for="tag in project.stack" :key="tag" data-folio-tag>{{ tag }}</span>
        </div>
      </div>
      
      <div data-folio-view-section data-folio-view-section-name="struggles">
        <h4>Struggles</h4>
        <div v-for="(struggle, index) in project.struggles" :key="index" data-folio-struggle :data-folio-struggle-type="struggle.type">
          {{ struggle.text }}
        </div>
      </div>
      
      <div data-folio-view-section data-folio-view-section-name="timeline">
        <h4>Timeline</h4>
        <div v-for="(entry, index) in project.timeline" :key="index">
          <span data-folio-timeline-date>{{ entry.date }}</span>
          <span data-folio-timeline-note>{{ entry.note }}</span>
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
