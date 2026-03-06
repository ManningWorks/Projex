import { normalise } from '@reallukemanning/folio'
import { exampleConfigs } from './configs'
import type { FolioProject } from '@reallukemanning/folio'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateNormalisedData() {
  const results = await Promise.all([
    normalise(exampleConfigs.react),
    normalise(exampleConfigs.nextjs),
    normalise(exampleConfigs.tailwindcss),
    normalise(exampleConfigs.lodash),
    normalise(exampleConfigs['date-fns']),
    normalise(exampleConfigs.zod),
    normalise(exampleConfigs['tailwind-merge']),
    normalise(exampleConfigs.portfolio),
  ])

  const normalisedExamples: Record<string, FolioProject> = {
    react: results[0],
    nextjs: results[1],
    tailwindcss: results[2],
    lodash: results[3],
    'date-fns': results[4],
    zod: results[5],
    'tailwind-merge': results[6],
    portfolio: results[7],
  }

  const outputPath = join(__dirname, 'normalised.ts')
  const content = `import type { FolioProject } from '@reallukemanning/folio'

export const normalisedExamples: Record<string, FolioProject> = ${JSON.stringify(normalisedExamples, null, 2) as any}
`

  writeFileSync(outputPath, content, 'utf-8')
  console.log('✓ Generated normalised data')
}

generateNormalisedData().catch(console.error)
