import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'

import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    // No custom components needed
  }
}
