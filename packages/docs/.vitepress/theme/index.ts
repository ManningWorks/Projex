import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import ProjectCardPreview from './components/ProjectCardPreview.vue'
import ProjectGridPreview from './components/ProjectGridPreview.vue'
import ProjectListPreview from './components/ProjectListPreview.vue'
import ProjectViewPreview from './components/ProjectViewPreview.vue'
import FeaturedProjectPreview from './components/FeaturedProjectPreview.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('ProjectCardPreview', ProjectCardPreview)
    app.component('ProjectGridPreview', ProjectGridPreview)
    app.component('ProjectListPreview', ProjectListPreview)
    app.component('ProjectViewPreview', ProjectViewPreview)
    app.component('FeaturedProjectPreview', FeaturedProjectPreview)
  }
}
