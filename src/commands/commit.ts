import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import type { CommitConfig } from '../types.js';
import { collectCommitConfig } from '../prompts/commit.js';
import { generateCommitlintConfig } from '../generators/commitlint.js';
import { generateCzConfig } from '../generators/cz-config.js';
import { updateTargetPackageJson } from '../utils/package.js';
import { initHusky } from '../utils/husky.js';
import { setupCommitizen } from '../utils/commitizen.js';

// 检测项目的模块类型
async function detectModuleType(targetDir: string): Promise<'esm' | 'cjs'> {
  const packageJsonPath = join(targetDir, 'package.json');
  try {
    if (existsSync(packageJsonPath)) {
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      return packageJson.type === 'module' ? 'esm' : 'cjs';
    }
  } catch (error) {
    // 忽略错误
  }
  return 'cjs';
}

// 生成配置文件
async function generateConfigFiles(
  targetDir: string,
  config: CommitConfig
): Promise<void> {
  const moduleType = await detectModuleType(targetDir);
  const configFileName = moduleType === 'esm' 
    ? 'commitlint.config.cjs' 
    : 'commitlint.config.js';
  
  const commitlintConfigPath = join(targetDir, configFileName);
  await writeFile(
    commitlintConfigPath,
    generateCommitlintConfig(config),
    'utf-8'
  );
  console.log(chalk.green(`✓ 已创建 ${configFileName}`));

  if (config.useCommitizen) {
    const czConfigPath = join(targetDir, '.cz-config.cjs');
    await writeFile(
      czConfigPath,
      generateCzConfig(config),
      'utf-8'
    );
    console.log(chalk.green('✓ 已创建 .cz-config.cjs'));
  }

  await updateTargetPackageJson(targetDir, config);

  if (config.useHusky) {
    await initHusky(targetDir, config);
  }

  if (config.useCommitizen) {
    await setupCommitizen(targetDir);
  }
}

// 配置 Git 提交规范
export async function setupCommitConfig(): Promise<void> {
  try {
    const targetDir = process.cwd();
    const config = await collectCommitConfig();

    console.log(chalk.blue('\n开始生成配置文件...\n'));
    await generateConfigFiles(targetDir, config);

    console.log(chalk.green('\n✓ Git 提交规范配置完成！'));
  } catch (error) {
    console.error(chalk.red(`错误: ${error}`));
    process.exit(1);
  }
}

