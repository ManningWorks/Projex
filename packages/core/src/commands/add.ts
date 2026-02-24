import { mkdir, access, copyFile, readdir, readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { existsSync } from 'node:fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

interface ComponentMapping {
  [key: string]: {
    sourcePath: string
    destName: string
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const COMPONENTS: ComponentMapping = {
  'github-card': {
    sourcePath: resolve(__dirname, '../components/GitHubCard'),
    destName: 'GitHubCard',
  },
  'npm-card': {
    sourcePath: resolve(__dirname, '../components/NpmCard'),
    destName: 'NpmCard',
  },
  'showcase-card': {
    sourcePath: resolve(__dirname, '../components/ShowcaseCard'),
    destName: 'ShowcaseCard',
  },
  'project-card': {
    sourcePath: resolve(__dirname, '../components/ProjectCard'),
    destName: 'ProjectCard',
  },
  'project-view': {
    sourcePath: resolve(__dirname, '../components/ProjectView'),
    destName: 'ProjectView',
  },
  'project-grid': {
    sourcePath: resolve(__dirname, '../components/ProjectGrid'),
    destName: 'ProjectGrid',
  },
  'project-list': {
    sourcePath: resolve(__dirname, '../components/ProjectList'),
    destName: 'ProjectList',
  },
  'featured-project': {
    sourcePath: resolve(__dirname, '../components/FeaturedProject'),
    destName: 'FeaturedProject',
  },
}

interface AddOptions {
  force?: boolean
}

export async function add(componentName: string, options: AddOptions = {}): Promise<void> {
  const workingDir = process.cwd()
  const component = COMPONENTS[componentName]

  if (!component) {
    console.error(chalk.red(`✖ Component "${componentName}" not found`))
    console.log()
    console.log(chalk.bold('Available components:'))
    Object.keys(COMPONENTS).forEach((name) => {
      console.log(chalk.gray(`  - ${name}`))
    })
    console.log()
    console.log(chalk.gray('Usage: npx folio add <component-name>'))
    process.exit(1)
  }

  const destDir = resolve(workingDir, 'components', 'folio', component.destName)

  console.log(chalk.bold(`📦 Adding ${componentName}...`))
  console.log()

  await ensureFolioInstalled()

  try {
    const sourceFiles = await getSourceFiles(component.sourcePath)

    if (sourceFiles.length === 0) {
      console.error(chalk.red(`✖ No files found for ${componentName}`))
      console.error(chalk.gray('  Try reinstalling @folio/cli'))
      process.exit(1)
    }

    const existingFiles = await checkExistingFiles(destDir, sourceFiles)

    if (existingFiles.length > 0 && !options.force) {
      console.log(chalk.yellow(`⚠ Found ${existingFiles.length} existing file(s):`))
      existingFiles.forEach((file) => {
        console.log(chalk.gray(`  - ${file}`))
      })
      console.log()

      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite existing files?',
          default: false,
        },
      ])

      if (!overwrite) {
        console.log(chalk.yellow('✖ Add cancelled.'))
        return
      }
    } else if (existingFiles.length > 0 && options.force) {
      console.log(chalk.yellow(`⚠ Overwriting ${existingFiles.length} existing file(s) (--force)`))
    }

    await createDirectory(destDir)
    await copyFiles(sourceFiles, destDir)
    await transformFiles(sourceFiles, destDir)

    console.log(chalk.green(`✓ ${componentName} added successfully`))
    console.log()
    console.log(chalk.bold('Import usage:'))
    console.log(chalk.gray(`  import { ${component.destName} } from './components/folio/${component.destName}'`))
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'EACCES') {
        console.error(chalk.red(`✖ Permission denied`))
        console.error(chalk.gray(`  Cannot write to ${destDir}`))
        console.error(chalk.gray('  Check file permissions and try again.'))
        process.exit(1)
      } else if (error.code === 'ENOENT') {
        console.error(chalk.red(`✖ Source files not found`))
        console.error(chalk.gray('  Try reinstalling @folio/cli'))
        process.exit(1)
      }
    }

    console.error(chalk.red('✖ Failed to add component'))
    console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`))
    process.exit(1)
  }
}

async function getSourceFiles(sourcePath: string): Promise<string[]> {
  try {
    const files = await readdir(sourcePath)
    const filePaths = files
      .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
      .map((file) => resolve(sourcePath, file))
    return filePaths
  } catch {
    return []
  }
}

async function checkExistingFiles(destDir: string, sourceFiles: string[]): Promise<string[]> {
  try {
    await access(destDir)
  } catch {
    return []
  }

  const existing: string[] = []

  for (const sourceFile of sourceFiles) {
    const fileName = sourceFile.split('/').pop() as string
    const destPath = resolve(destDir, fileName)

    try {
      await access(destPath)
      existing.push(fileName)
    } catch {
    }
  }

  return existing
}

async function ensureFolioInstalled(): Promise<void> {
  const packageJsonPath = resolve(process.cwd(), 'package.json')
  const content = await readFile(packageJsonPath, 'utf-8')
  const pkg = JSON.parse(content)

  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if ('@reallukemanning/folio' in deps) {
    return
  }

  const hasPnpm = existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))
  const hasYarn = existsSync(resolve(process.cwd(), 'yarn.lock'))

  const installCmd = hasPnpm ? 'pnpm add' : hasYarn ? 'yarn add' : 'npm install'

  console.log(chalk.gray(`  Installing @reallukemanning/folio...`))
  execSync(`${installCmd} @reallukemanning/folio`, { stdio: 'inherit' })
  console.log(chalk.gray(`  ✓ @reallukemanning/folio installed`))
}

async function transformImports(filePath: string): Promise<void> {
  const content = await readFile(filePath, 'utf-8')
  let transformed = content

  transformed = transformed.replace(
    /from ['"]\.\.\/types['"]/g,
    "from '@reallukemanning/folio'"
  )

  transformed = transformed.replace(
    /from ['"]\.\.\/\.\.\/types['"]/g,
    "from '@reallukemanning/folio'"
  )

  const { writeFile } = await import('node:fs/promises')
  await writeFile(filePath, transformed, 'utf-8')
}

async function transformFiles(sourceFiles: string[], destDir: string): Promise<void> {
  for (const sourceFile of sourceFiles) {
    const fileName = sourceFile.split('/').pop() as string
    const destPath = resolve(destDir, fileName)
    await transformImports(destPath)
  }
}

async function createDirectory(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
      throw error
    }
  }
}

async function copyFiles(sourceFiles: string[], destDir: string): Promise<void> {
  for (const sourceFile of sourceFiles) {
    const fileName = sourceFile.split('/').pop() as string
    const destPath = resolve(destDir, fileName)
    await copyFile(sourceFile, destPath)
  }
}
