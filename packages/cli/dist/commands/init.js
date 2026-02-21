import { readFile, writeFile, access, constants } from 'node:fs/promises';
import { resolve } from 'node:path';
import inquirer from 'inquirer';
import chalk from 'chalk';
const CONFIG_FILE = 'folio.config.ts';
const PACKAGE_JSON = 'package.json';
export async function init() {
    const workingDir = process.cwd();
    console.log(chalk.bold('🚀 Initializing Folio project...'));
    console.log();
    try {
        await access(CONFIG_FILE, constants.F_OK);
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `${CONFIG_FILE} already exists. Overwrite?`,
                default: false,
            },
        ]);
        if (!overwrite) {
            console.log(chalk.yellow('✖ Init cancelled.'));
            return;
        }
    }
    catch {
    }
    const isNextJs = await detectNextJs(workingDir);
    if (isNextJs) {
        console.log(chalk.green('✓ Next.js project detected'));
    }
    else {
        console.log(chalk.yellow('⚠ Next.js not detected. Folio is optimized for Next.js projects.'));
    }
    console.log();
    try {
        const template = generateConfigTemplate();
        const configPath = resolve(workingDir, CONFIG_FILE);
        await writeFile(configPath, template, 'utf-8');
        console.log(chalk.green(`✓ ${CONFIG_FILE} created successfully`));
        console.log();
        console.log(chalk.bold('Next steps:'));
        console.log(chalk.gray('1. Edit folio.config.ts to add your projects'));
        console.log(chalk.gray('2. Import and use the components in your Next.js app'));
        console.log(chalk.gray('3. See https://docs.folio.dev for usage examples'));
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
            console.error(chalk.red(`✖ Permission denied. Cannot write to ${CONFIG_FILE}`));
            console.error(chalk.gray('  Check file permissions and try again.'));
        }
        else {
            console.error(chalk.red('✖ Failed to create folio.config.ts'));
            console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
        process.exit(1);
    }
}
async function detectNextJs(workingDir) {
    const packagePath = resolve(workingDir, PACKAGE_JSON);
    try {
        await access(packagePath, constants.F_OK);
    }
    catch {
        console.log(chalk.yellow(`⚠ ${PACKAGE_JSON} not found. Proceeding with basic scaffold.`));
        return false;
    }
    try {
        const content = await readFile(packagePath, 'utf-8');
        const pkg = JSON.parse(content);
        if (!pkg || typeof pkg !== 'object') {
            return false;
        }
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        return 'next' in deps;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            console.error(chalk.red(`✖ ${PACKAGE_JSON} is not valid JSON`));
            console.error(chalk.gray('  Check syntax and try again.'));
        }
        else {
            console.error(chalk.red(`✖ Error reading ${PACKAGE_JSON}`));
            console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
        return false;
    }
}
function generateConfigTemplate() {
    return `import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/repo',
    status: 'active',
    featured: true,
    background: 'A brief background of your project...',
    why: 'Why you built this project...',
    stack: ['TypeScript', 'React', 'Next.js'],
    struggles: [],
    timeline: [],
    posts: [],
  },
])
`;
}
//# sourceMappingURL=init.js.map