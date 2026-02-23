import { mkdir, readdir, copyFile, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function copyDirectory(src, dst) {
  await mkdir(dst, { recursive: true })

  const files = await readdir(src)

  for (const file of files) {
    const srcPath = join(src, file)
    const dstPath = join(dst, file)
    const fileStat = await stat(srcPath)

    if (fileStat.isDirectory()) {
      await copyDirectory(srcPath, dstPath)
    } else {
      await copyFile(srcPath, dstPath)
    }
  }
}

async function main() {
  await copyDirectory(join(__dirname, 'src/components'), join(__dirname, 'dist/components'))
}

main().catch(console.error)
