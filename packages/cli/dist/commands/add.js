import { mkdir, access, copyFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = {
    'project-card': {
        sourcePath: resolve(__dirname, '../components/ProjectCard'),
        destName: 'ProjectCard',
    },
    'project-view': {
        sourcePath: resolve(__dirname, '../components/ProjectView'),
        destName: 'ProjectView',
    },
};
export async function add(componentName) {
    const workingDir = process.cwd();
    const component = COMPONENTS[componentName];
    if (!component) {
        console.error(chalk.red(`✖ Component "${componentName}" not found`));
        console.log();
        console.log(chalk.bold('Available components:'));
        Object.keys(COMPONENTS).forEach((name) => {
            console.log(chalk.gray(`  - ${name}`));
        });
        console.log();
        console.log(chalk.gray('Usage: npx folio add <component-name>'));
        process.exit(1);
    }
    const destDir = resolve(workingDir, 'components', 'folio', component.destName);
    console.log(chalk.bold(`📦 Adding ${componentName}...`));
    console.log();
    try {
        const sourceFiles = await getSourceFiles(component.sourcePath);
        if (sourceFiles.length === 0) {
            console.error(chalk.red(`✖ No files found for ${componentName}`));
            console.error(chalk.gray('  Try reinstalling @folio/cli'));
            process.exit(1);
        }
        const existingFiles = await checkExistingFiles(destDir, sourceFiles);
        if (existingFiles.length > 0) {
            console.log(chalk.yellow(`⚠ Found ${existingFiles.length} existing file(s):`));
            existingFiles.forEach((file) => {
                console.log(chalk.gray(`  - ${file}`));
            });
            console.log();
            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Overwrite existing files?',
                    default: false,
                },
            ]);
            if (!overwrite) {
                console.log(chalk.yellow('✖ Add cancelled.'));
                return;
            }
        }
        await createDirectory(destDir);
        await copyFiles(sourceFiles, destDir);
        console.log(chalk.green(`✓ ${componentName} added successfully`));
        console.log();
        console.log(chalk.bold('Import usage:'));
        console.log(chalk.gray(`  import { ${component.destName} } from './components/folio/${component.destName}'`));
    }
    catch (error) {
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'EACCES') {
                console.error(chalk.red(`✖ Permission denied`));
                console.error(chalk.gray(`  Cannot write to ${destDir}`));
                console.error(chalk.gray('  Check file permissions and try again.'));
                process.exit(1);
            }
            else if (error.code === 'ENOENT') {
                console.error(chalk.red(`✖ Source files not found`));
                console.error(chalk.gray('  Try reinstalling @folio/cli'));
                process.exit(1);
            }
        }
        console.error(chalk.red('✖ Failed to add component'));
        console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
    }
}
async function getSourceFiles(sourcePath) {
    try {
        const files = await readdir(sourcePath);
        const filePaths = files
            .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
            .map((file) => resolve(sourcePath, file));
        return filePaths;
    }
    catch {
        return [];
    }
}
async function checkExistingFiles(destDir, sourceFiles) {
    try {
        await access(destDir);
    }
    catch {
        return [];
    }
    const existing = [];
    for (const sourceFile of sourceFiles) {
        const fileName = sourceFile.split('/').pop();
        const destPath = resolve(destDir, fileName);
        try {
            await access(destPath);
            existing.push(fileName);
        }
        catch {
        }
    }
    return existing;
}
async function createDirectory(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
            throw error;
        }
    }
}
async function copyFiles(sourceFiles, destDir) {
    for (const sourceFile of sourceFiles) {
        const fileName = sourceFile.split('/').pop();
        const destPath = resolve(destDir, fileName);
        await copyFile(sourceFile, destPath);
    }
}
//# sourceMappingURL=add.js.map