import {
  Project,
  SyntaxKind,
} from 'ts-morph'
import type {
  ArrayLiteralExpression,
  CallExpression,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
  StringLiteral,
} from 'ts-morph'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const CONFIG_FILE = 'projex.config.ts'

export class ConfigEditorError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigEditorError'
  }
}

function getConfigPath(configPath?: string): string {
  const path = configPath ?? resolve(process.cwd(), CONFIG_FILE)
  if (!existsSync(path)) {
    throw new ConfigEditorError(
      `Config file not found at ${path}. Run 'projex init' first.`,
    )
  }
  return path
}

function findDefineProjectsCall(sourceFile: SourceFile): CallExpression {
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  )
  for (const call of callExpressions) {
    const expr = call.getExpression()
    if (expr.getText() === 'defineProjects') {
      return call
    }
  }
  throw new ConfigEditorError(
    'Could not find defineProjects() call in config file. Ensure your config uses defineProjects([...]).',
  )
}

function getProjectsArray(sourceFile: SourceFile): ArrayLiteralExpression {
  const call = findDefineProjectsCall(sourceFile)
  const args = call.getArguments()
  if (args.length === 0) {
    throw new ConfigEditorError('defineProjects() has no arguments.')
  }
  const arrayArg = args[0]
  if (!arrayArg.isKind(SyntaxKind.ArrayLiteralExpression)) {
    throw new ConfigEditorError(
      'defineProjects() first argument is not an array.',
    )
  }
  return arrayArg.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
}

function getProjectIdsFromArray(array: ArrayLiteralExpression): string[] {
  const ids: string[] = []
  for (const element of array.getElements()) {
    if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) continue
    const idProp = element.getProperty('id')
    if (!idProp || !idProp.isKind(SyntaxKind.PropertyAssignment)) continue
    const init = idProp.getInitializer()
    if (!init || !init.isKind(SyntaxKind.StringLiteral)) continue
    ids.push(init.getLiteralValue())
  }
  return ids
}

function findProjectById(
  array: ArrayLiteralExpression,
  id: string,
): ObjectLiteralExpression {
  for (const element of array.getElements()) {
    if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) continue
    const idProp = element.getProperty('id')
    if (!idProp || !idProp.isKind(SyntaxKind.PropertyAssignment)) continue
    const init = idProp.getInitializer()
    if (!init || !init.isKind(SyntaxKind.StringLiteral)) continue
    if (init.getLiteralValue() === id) {
      return element
    }
  }
  const validIds = getProjectIdsFromArray(array)
  throw new ConfigEditorError(
    `Project '${id}' not found. Valid IDs: ${validIds.length > 0 ? validIds.join(', ') : 'none'}`,
  )
}

function getOrCreateArrayProperty(
  obj: ObjectLiteralExpression,
  propertyName: string,
): ArrayLiteralExpression {
  const prop = obj.getProperty(propertyName)
  if (prop && prop.isKind(SyntaxKind.PropertyAssignment)) {
    const init = prop.getInitializer()
    if (init && init.isKind(SyntaxKind.ArrayLiteralExpression)) {
      return init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
    }
  }
  const newProp = obj.addPropertyAssignment({
    name: propertyName,
    initializer: '[]',
  })
  const init = newProp.getInitializer()
  if (!init || !init.isKind(SyntaxKind.ArrayLiteralExpression)) {
    throw new ConfigEditorError(`Failed to create ${propertyName} array.`)
  }
  return init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
}

function buildProjectObjectText(input: AddProjectInput): string {
  const lines: string[] = []
  lines.push('{')
  lines.push(`    id: '${escapeString(input.id)}',`)
  lines.push(`    type: '${escapeString(input.type)}',`)
  if (input.repo) lines.push(`    repo: '${escapeString(input.repo)}',`)
  if (input.package) lines.push(`    package: '${escapeString(input.package)}',`)
  if (input.slug) lines.push(`    slug: '${escapeString(input.slug)}',`)
  if (input.channelId) lines.push(`    channelId: '${escapeString(input.channelId)}',`)
  if (input.productId) lines.push(`    productId: '${escapeString(input.productId)}',`)
  if (input.storeId) lines.push(`    storeId: '${escapeString(input.storeId)}',`)
  if (input.username) lines.push(`    username: '${escapeString(input.username)}',`)
  lines.push(`    status: '${escapeString(input.status)}',`)
  lines.push(`    featured: ${input.featured},`)
  if (input.name) lines.push(`    name: '${escapeString(input.name)}',`)
  if (input.description) {
    lines.push(`    description: '${escapeString(input.description)}',`)
  }
  if (input.stack && input.stack.length > 0) {
    lines.push(
      `    stack: [${input.stack.map((s) => `'${escapeString(s)}'`).join(', ')}],`,
    )
  }
  lines.push('    struggles: [],')
  lines.push('    timeline: [],')
  lines.push('    posts: [],')
  lines.push('  }')
  return lines.join('\n')
}

export interface AddProjectInput {
  id: string
  type: string
  status: string
  featured: boolean
  name?: string
  description?: string
  stack?: string[]
  repo?: string
  package?: string
  slug?: string
  channelId?: string
  productId?: string
  storeId?: string
  username?: string
}

export interface AddLearningInput {
  type: 'challenge' | 'learning'
  text: string
}

export interface AddTimelineEntryInput {
  date: string
  note: string
}

export interface AddPostInput {
  title: string
  date: string
  url?: string
}

export function getProjectIds(configPath?: string): string[] {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  return getProjectIdsFromArray(array)
}

export function addProject(
  input: AddProjectInput,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)

  const existingIds = getProjectIdsFromArray(array)
  if (existingIds.includes(input.id)) {
    throw new ConfigEditorError(`Project ID '${input.id}' already exists.`)
  }

  const projectText = buildProjectObjectText(input)
  array.addElement(projectText)
  sourceFile.saveSync()
}

export function addLearning(
  projectId: string,
  input: AddLearningInput,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const strugglesArray = getOrCreateArrayProperty(projectObj, 'struggles')
  strugglesArray.addElement(
    `{ type: '${input.type}', text: '${escapeString(input.text)}' }`,
  )
  sourceFile.saveSync()
}

export function addTimelineEntry(
  projectId: string,
  input: AddTimelineEntryInput,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const timelineArray = getOrCreateArrayProperty(projectObj, 'timeline')
  timelineArray.addElement(
    `{ date: '${escapeString(input.date)}', note: '${escapeString(input.note)}' }`,
  )
  sourceFile.saveSync()
}

export function addPost(
  projectId: string,
  input: AddPostInput,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const postsArray = getOrCreateArrayProperty(projectObj, 'posts')
  const urlPart = input.url ? `, url: '${escapeString(input.url)}'` : ''
  postsArray.addElement(
    `{ title: '${escapeString(input.title)}', date: '${escapeString(input.date)}'${urlPart} }`,
  )
  sourceFile.saveSync()
}

function removeArrayElement(
  arr: ArrayLiteralExpression,
  index: number,
  label: string,
): void {
  const elements = arr.getElements()
  if (index < 0 || index >= elements.length) {
    throw new ConfigEditorError(
      `Invalid ${label} index ${index}. Must be 0-${elements.length > 0 ? elements.length - 1 : 0}.`,
    )
  }
  arr.removeElement(index)
}

function getStringProperty(
  obj: ObjectLiteralExpression,
  propertyName: string,
): string | undefined {
  const prop = obj.getProperty(propertyName)
  if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) return undefined
  const init = (prop as PropertyAssignment).getInitializer()
  if (!init || !init.isKind(SyntaxKind.StringLiteral)) return undefined
  return (init as StringLiteral).getLiteralValue()
}

function getBooleanProperty(
  obj: ObjectLiteralExpression,
  propertyName: string,
): boolean {
  const prop = obj.getProperty(propertyName)
  if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) return false
  const init = (prop as PropertyAssignment).getInitializer()
  if (!init) return false
  if (init.isKind(SyntaxKind.TrueKeyword)) return true
  if (init.isKind(SyntaxKind.FalseKeyword)) return false
  return false
}

export function removeProject(
  projectId: string,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const elements = array.getElements()
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) continue
    const idProp = element.getProperty('id')
    if (!idProp || !idProp.isKind(SyntaxKind.PropertyAssignment)) continue
    const init = (idProp as PropertyAssignment).getInitializer()
    if (!init || !init.isKind(SyntaxKind.StringLiteral)) continue
    if ((init as StringLiteral).getLiteralValue() === projectId) {
      array.removeElement(i)
      sourceFile.saveSync()
      return
    }
  }
  const validIds = getProjectIdsFromArray(array)
  throw new ConfigEditorError(
    `Project '${projectId}' not found. Valid IDs: ${validIds.length > 0 ? validIds.join(', ') : 'none'}`,
  )
}

export function removeLearning(
  projectId: string,
  index: number,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const strugglesArray = getOrCreateArrayProperty(projectObj, 'struggles')
  removeArrayElement(strugglesArray, index, 'learning')
  sourceFile.saveSync()
}

export function removeTimelineEntry(
  projectId: string,
  index: number,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const timelineArray = getOrCreateArrayProperty(projectObj, 'timeline')
  removeArrayElement(timelineArray, index, 'timeline')
  sourceFile.saveSync()
}

export function removePost(
  projectId: string,
  index: number,
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const postsArray = getOrCreateArrayProperty(projectObj, 'posts')
  removeArrayElement(postsArray, index, 'post')
  sourceFile.saveSync()
}

export function removeProjectField(
  projectId: string,
  field: string,
  configPath?: string,
): boolean {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)

  const prop = projectObj.getProperty(field)
  if (!prop) return false

  prop.remove()
  sourceFile.saveSync()
  return true
}

export function setProjectField(
  projectId: string,
  field: string,
  value: string | boolean | string[],
  configPath?: string,
): void {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)

  const existingProp = projectObj.getProperty(field)

  if (typeof value === 'boolean') {
    if (existingProp && existingProp.isKind(SyntaxKind.PropertyAssignment)) {
      ;(existingProp as PropertyAssignment).setInitializer(String(value))
    } else {
      projectObj.addPropertyAssignment({ name: field, initializer: String(value) })
    }
  } else if (Array.isArray(value)) {
    const initializer = `[${value.map((s) => `'${escapeString(s)}'`).join(', ')}]`
    if (existingProp && existingProp.isKind(SyntaxKind.PropertyAssignment)) {
      ;(existingProp as PropertyAssignment).setInitializer(initializer)
    } else {
      projectObj.addPropertyAssignment({ name: field, initializer })
    }
  } else {
    if (existingProp && existingProp.isKind(SyntaxKind.PropertyAssignment)) {
      ;(existingProp as PropertyAssignment).setInitializer(`'${escapeString(value)}'`)
    } else {
      projectObj.addPropertyAssignment({ name: field, initializer: `'${escapeString(value)}'` })
    }
  }

  sourceFile.saveSync()
}

export function getArrayLength(
  projectId: string,
  arrayName: 'struggles' | 'timeline' | 'posts',
  configPath?: string,
): number {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const prop = projectObj.getProperty(arrayName)
  if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) return 0
  const init = (prop as PropertyAssignment).getInitializer()
  if (!init || !init.isKind(SyntaxKind.ArrayLiteralExpression)) return 0
  return init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression).getElements().length
}

export interface LearningEntry {
  index: number
  type: string
  text: string
}

export interface TimelineEntry {
  index: number
  date: string
  note: string
}

export interface PostEntry {
  index: number
  title: string
  date: string
  url?: string
}

function getProjectArrayEntries(
  projectId: string,
  arrayName: 'struggles' | 'timeline' | 'posts',
  configPath?: string,
): { index: number, obj: ObjectLiteralExpression }[] {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const projectObj = findProjectById(array, projectId)
  const prop = projectObj.getProperty(arrayName)
  if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) return []
  const init = (prop as PropertyAssignment).getInitializer()
  if (!init || !init.isKind(SyntaxKind.ArrayLiteralExpression)) return []
  const arr = init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
  const entries: { index: number, obj: ObjectLiteralExpression }[] = []
  const elements = arr.getElements()
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (el.isKind(SyntaxKind.ObjectLiteralExpression)) {
      entries.push({ index: i, obj: el.asKindOrThrow(SyntaxKind.ObjectLiteralExpression) })
    }
  }
  return entries
}

export function getLearningEntries(
  projectId: string,
  configPath?: string,
): LearningEntry[] {
  return getProjectArrayEntries(projectId, 'struggles', configPath).map(
    ({ index, obj }) => ({
      index,
      type: getStringProperty(obj, 'type') ?? 'learning',
      text: getStringProperty(obj, 'text') ?? '',
    }),
  )
}

export function getTimelineEntries(
  projectId: string,
  configPath?: string,
): TimelineEntry[] {
  return getProjectArrayEntries(projectId, 'timeline', configPath).map(
    ({ index, obj }) => ({
      index,
      date: getStringProperty(obj, 'date') ?? '',
      note: getStringProperty(obj, 'note') ?? '',
    }),
  )
}

export function getPostEntries(
  projectId: string,
  configPath?: string,
): PostEntry[] {
  return getProjectArrayEntries(projectId, 'posts', configPath).map(
    ({ index, obj }) => ({
      index,
      title: getStringProperty(obj, 'title') ?? '',
      date: getStringProperty(obj, 'date') ?? '',
      url: getStringProperty(obj, 'url'),
    }),
  )
}

export interface ProjectSummary {
  id: string
  type: string
  status: string
  featured: boolean
  name: string
}

export function getProjectSummaries(configPath?: string): ProjectSummary[] {
  const path = getConfigPath(configPath)
  const tsProject = new Project()
  const sourceFile = tsProject.addSourceFileAtPath(path)
  const array = getProjectsArray(sourceFile)
  const summaries: ProjectSummary[] = []

  for (const element of array.getElements()) {
    if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) continue
    const obj = element.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    const id = getStringProperty(obj, 'id') ?? ''
    const type = getStringProperty(obj, 'type') ?? ''
    const status = getStringProperty(obj, 'status') ?? ''
    const featured = getBooleanProperty(obj, 'featured')
    const name = getStringProperty(obj, 'name') ?? id
    summaries.push({ id, type, status, featured, name })
  }

  return summaries
}
