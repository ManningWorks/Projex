import { cpSync, existsSync, rmSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..', '..')
const distDir = join(__dirname, '.vitepress', 'dist')
const srcDir = join(distDir, 'src')
const assetsSource = join(distDir, 'assets')
const assetsDest = join(srcDir, 'assets')

if (existsSync(assetsDest)) {
  rmSync(assetsDest, { recursive: true })
}

if (existsSync(assetsSource)) {
  cpSync(assetsSource, assetsDest, { recursive: true })
}
