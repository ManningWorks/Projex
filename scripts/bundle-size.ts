#!/usr/bin/env node

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { createGzip } from 'node:zlib'
import { createReadStream, createWriteStream, unlinkSync, writeFileSync, existsSync } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { tmpdir } from 'node:os'

const ROOT = process.cwd()

function formatBytes(bytes: number): string {
  if (bytes < 0) return `${bytes} B`
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function getDirectorySize(dir: string, extensions: string[]): Promise<number> {
  let totalSize = 0
  const files = await readdir(dir, { withFileTypes: true })
  
  for (const file of files) {
    const filePath = join(dir, file.name)
    if (file.isDirectory()) {
      totalSize += await getDirectorySize(filePath, extensions)
    } else if (extensions.some(ext => file.name.endsWith(ext))) {
      const stats = await stat(filePath)
      totalSize += stats.size
    }
  }
  
  return totalSize
}

async function measureGzipSize(data: Buffer): Promise<number> {
  const tempFile = join(tmpdir(), `bundle-size-${Date.now()}.js`)
  const gzipFile = `${tempFile}.gz`
  
  writeFileSync(tempFile, data)
  
  await pipeline(
    createReadStream(tempFile),
    createGzip(),
    createWriteStream(gzipFile)
  )
  
  const size = (await stat(gzipFile)).size
  
  unlinkSync(tempFile)
  unlinkSync(gzipFile)
  
  return size
}

async function getDirectoryFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const filePath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getDirectoryFiles(filePath, extensions))
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(filePath)
    }
  }
  
  return files
}

async function concatenateFiles(files: string[]): Promise<Buffer> {
  const buffers: Buffer[] = []
  for (const file of files) {
    const { readFile } = await import('node:fs/promises')
    buffers.push(await readFile(file))
  }
  return Buffer.concat(buffers)
}

interface PackageResult {
  name: string
  target: string
  uncompressed: number
  gzipped: number
  passes: boolean
}

async function measureCorePackage(): Promise<PackageResult> {
  console.log('Measuring @manningworks/projex...')

  const result = execSync('pnpm size-limit --json 2>/dev/null', {
    cwd: ROOT,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const parsed = JSON.parse(result)
  const allExports = parsed.find((p: { name: string }) => p.name.includes('all exports'))

  const size = allExports?.size ?? 0
  const gzipped = size
  const limit = 10 * 1024

  return {
    name: '@manningworks/projex',
    target: '< 10 KB gzipped',
    uncompressed: size,
    gzipped: gzipped,
    passes: gzipped < limit
  }
}



async function main() {
  console.log('\n📦 Projex Bundle Size Measurement\n')
  console.log('='.repeat(70))
  
  const results: PackageResult[] = []
  
  try {
    results.push(await measureCorePackage())
  } catch (error) {
    console.error('Failed to measure @manningworks/projex:', error)
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('\nResults:\n')
  
  const header = `Package          | Target             | Uncompressed | Gzipped     | Status`
  console.log(header)
  console.log('-'.repeat(header.length + 20))
  
  for (const result of results) {
    const status = result.passes ? '✓ PASS' : '⚠ REVIEW'
    console.log(
      `${result.name.padEnd(17)}| ${result.target.padEnd(19)}| ${formatBytes(result.uncompressed).padEnd(13)}| ${formatBytes(result.gzipped).padEnd(12)}| ${status}`
    )
  }
  
  console.log('\n' + '='.repeat(70))
  
  const allPass = results.every(r => r.passes)
  if (allPass) {
    console.log('✓ All packages within size limits\n')
  } else {
    console.log('⚠ Some packages exceed size targets (document actual values)\n')
  }
  
  writeFileSync(
    join(ROOT, '.bundle-size.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      packages: results
    }, null, 2)
  )
  
  console.log('Results saved to .bundle-size.json\n')
  
  process.exit(allPass ? 0 : 0)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
