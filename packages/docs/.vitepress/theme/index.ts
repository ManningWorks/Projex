import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'

import ReactWrapper from './components/ReactWrapper.vue'
import ComponentPreview from './components/ComponentPreview.vue'
import CodeBlock from './components/CodeBlock.vue'
import ProjectCardPreview from './components/ProjectCardPreview.vue'
import ProjectGridPreview from './components/ProjectGridPreview.vue'
import ProjectListPreview from './components/ProjectListPreview.vue'
import ProjectViewPreview from './components/ProjectViewPreview.vue'
import FeaturedProjectPreview from './components/FeaturedProjectPreview.vue'

import {
  GitHubCardMinimalPreview,
  GitHubCardRealPreview,
  GitHubCardInteractiveDemo
} from './components/examples/github-card'

import {
  NpmCardMinimalPreview,
  NpmCardRealPreview,
  NpmCardInteractiveDemo
} from './components/examples/npm-card'

import {
  ShowcaseCardMinimalPreview,
  ShowcaseCardRealPreview,
  ShowcaseCardInteractiveDemo
} from './components/examples/showcase-card'

import {
  ProjectGridMinimalPreview,
  ProjectGridRealPreview,
  ProjectGridInteractiveDemo
} from './components/examples/project-grid'

import {
  ProjectListMinimalPreview,
  ProjectListRealPreview
} from './components/examples/project-list'

import {
  FeaturedProjectMinimalPreview,
  FeaturedProjectRealPreview
} from './components/examples/featured-project'

import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('ReactWrapper', ReactWrapper)
    app.component('ComponentPreview', ComponentPreview)
    app.component('CodeBlock', CodeBlock)
    app.component('ProjectCardPreview', ProjectCardPreview)
    app.component('ProjectGridPreview', ProjectGridPreview)
    app.component('ProjectListPreview', ProjectListPreview)
    app.component('ProjectViewPreview', ProjectViewPreview)
    app.component('FeaturedProjectPreview', FeaturedProjectPreview)
    app.component('GitHubCardMinimalPreview', GitHubCardMinimalPreview)
    app.component('GitHubCardRealPreview', GitHubCardRealPreview)
    app.component('GitHubCardInteractiveDemo', GitHubCardInteractiveDemo)
    app.component('NpmCardMinimalPreview', NpmCardMinimalPreview)
    app.component('NpmCardRealPreview', NpmCardRealPreview)
    app.component('NpmCardInteractiveDemo', NpmCardInteractiveDemo)
    app.component('ShowcaseCardMinimalPreview', ShowcaseCardMinimalPreview)
    app.component('ShowcaseCardRealPreview', ShowcaseCardRealPreview)
    app.component('ShowcaseCardInteractiveDemo', ShowcaseCardInteractiveDemo)
    app.component('ProjectGridMinimalPreview', ProjectGridMinimalPreview)
    app.component('ProjectGridRealPreview', ProjectGridRealPreview)
    app.component('ProjectGridInteractiveDemo', ProjectGridInteractiveDemo)
    app.component('ProjectListMinimalPreview', ProjectListMinimalPreview)
    app.component('ProjectListRealPreview', ProjectListRealPreview)
    app.component('FeaturedProjectMinimalPreview', FeaturedProjectMinimalPreview)
    app.component('FeaturedProjectRealPreview', FeaturedProjectRealPreview)
  }
}
