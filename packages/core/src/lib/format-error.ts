import chalk from 'chalk'
import { z } from 'zod'

function formatPath(path: (string | number)[]): string {
  return path
    .map((segment, index) => {
      if (typeof segment === 'number') {
        return `[${segment}]`
      }
      if (index === 0) {
        return segment
      }
      return `.${segment}`
    })
    .join('')
}

function getExpectedValues(issue: z.ZodIssue): string | undefined {
  if (issue.code === 'invalid_enum_value') {
    return issue.options?.join(', ')
  }
  if (issue.code === 'too_small') {
    const ctx = issue as z.ZodIssue & { code: 'too_small'; minimum: number }
    if (ctx.type === 'string') {
      return `at least ${ctx.minimum} characters`
    }
    if (ctx.type === 'number') {
      return `at least ${ctx.minimum}`
    }
    if (ctx.type === 'array') {
      return `at least ${ctx.minimum} items`
    }
  }
  if (issue.code === 'too_big') {
    const ctx = issue as z.ZodIssue & { code: 'too_big'; maximum: number }
    if (ctx.type === 'string') {
      return `at most ${ctx.maximum} characters`
    }
    if (ctx.type === 'number') {
      return `at most ${ctx.maximum}`
    }
    if (ctx.type === 'array') {
      return `at most ${ctx.maximum} items`
    }
  }
  if (issue.code === 'invalid_string') {
    const ctx = issue as z.ZodInvalidStringIssue
    if (ctx.validation === 'email') {
      return 'valid email address (e.g., user@example.com)'
    }
    if (ctx.validation === 'url') {
      return 'valid URL (e.g., https://example.com)'
    }
    if (ctx.validation === 'uuid') {
      return 'valid UUID'
    }
    if (ctx.validation === 'regex') {
      return 'string matching required pattern'
    }
  }
  return undefined
}

function getSuggestion(issue: z.ZodIssue): string | undefined {
  if (issue.code === 'invalid_enum_value') {
    return `Expected one of: ${chalk.gray(issue.options?.join(', ') || 'unknown')}`
  }
  if (issue.code === 'invalid_type') {
    const ctx = issue as z.ZodInvalidTypeIssue
    if (ctx.received === 'undefined') {
      return `Add this field to your project configuration`
    }
    if (ctx.received === 'null') {
      return `Remove null or provide a value`
    }
  }
  if (issue.code === 'unrecognized_keys') {
    const ctx = issue as z.ZodUnrecognizedKeysIssue
    return `Remove unexpected keys: ${ctx.keys.join(', ')}`
  }
  if (issue.code === 'invalid_string') {
    const ctx = issue as z.ZodInvalidStringIssue
    if (ctx.validation === 'email') {
      return `Example: ${chalk.gray('"user@example.com"')}`
    }
    if (ctx.validation === 'url') {
      return `Example: ${chalk.gray('"https://example.com"')}`
    }
  }
  if (issue.code === 'custom') {
    return `Check the validation logic for this field`
  }
  return undefined
}

function formatIssue(issue: z.ZodIssue): string[] {
  const lines: string[] = []
  const path = formatPath(issue.path)

  const pathStr = path ? `${chalk.cyan(path)}: ` : ''
  lines.push(`${pathStr}${chalk.red(issue.message)}`)

  const expected = getExpectedValues(issue)
  if (expected) {
    lines.push(`  ${chalk.gray('Expected:')} ${chalk.yellow(expected)}`)
  }

  if (issue.code === 'invalid_type') {
    const ctx = issue as z.ZodInvalidTypeIssue
    lines.push(`  ${chalk.gray('Received:')} ${chalk.yellow(ctx.received)}`)
  }

  const suggestion = getSuggestion(issue)
  if (suggestion) {
    lines.push(`  ${chalk.green('Hint:')} ${suggestion}`)
  }

  return lines
}

export function formatZodError(error: z.ZodError): string {
  const lines: string[] = []

  lines.push(chalk.bold.red('✖ Validation failed'))

  const issueCount = error.issues.length
  const issueWord = issueCount === 1 ? 'issue' : 'issues'
  lines.push(`${chalk.gray(`${issueCount} ${issueWord} found:`)}\n`)

  const issuesByPath = new Map<string, z.ZodIssue[]>()
  for (const issue of error.issues) {
    const key = formatPath(issue.path)
    const existing = issuesByPath.get(key) || []
    existing.push(issue)
    issuesByPath.set(key, existing)
  }

  for (const [, issues] of issuesByPath) {
    for (const issue of issues) {
      lines.push(...formatIssue(issue))
    }
  }

  lines.push('')
  lines.push(chalk.gray('Tip: Check your projex.config.ts for the errors above.'))

  const hasTypeIssues = error.issues.some((i) => i.code === 'invalid_type')
  const hasEnumIssues = error.issues.some((i) => i.code === 'invalid_enum_value')
  if (hasTypeIssues || hasEnumIssues) {
    lines.push(chalk.gray('Refer to the docs: https://projex.manningworks.dev/docs/config'))
  }

  return lines.join('\n')
}
