import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..', '..')
const distDir = join(__dirname, '.vitepress', 'dist')
const srcDir = join(distDir, 'src')

if (existsSync(srcDir)) {
  const items = readdirSync(srcDir)
  
  for (const item of items) {
    const sourcePath = join(srcDir, item)
    const destPath = join(distDir, item)
    const stats = statSync(sourcePath)
    
    if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true })
    }
    cpSync(sourcePath, destPath, { recursive: true })
  }
  
  rmSync(srcDir, { recursive: true })
}
