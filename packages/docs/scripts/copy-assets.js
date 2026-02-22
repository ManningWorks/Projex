import { cpSync, existsSync, rmSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..', '..')
const distDir = join(__dirname, '.vitepress', 'dist')
const srcDir = join(distDir, 'src')

const filesToCopy = ['404.html', 'hashmap.json', 'vp-icons.css', 'assets']

for (const item of filesToCopy) {
  const sourcePath = join(distDir, item)
  const destPath = join(srcDir, item)
  
  if (existsSync(sourcePath)) {
    if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true })
    }
    cpSync(sourcePath, destPath, { recursive: true })
  }
}
