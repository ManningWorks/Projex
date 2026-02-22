import { cpSync, existsSync, rmSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..', '..')
const distDir = join(__dirname, '.vitepress', 'dist')

const filesToMove = ['index.html', '404.html', 'api']

for (const item of filesToMove) {
  const sourcePath = join(distDir, 'src', item)
  const destPath = join(distDir, item)
  
  if (existsSync(sourcePath)) {
    if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true })
    }
    cpSync(sourcePath, destPath, { recursive: true })
  }
}
