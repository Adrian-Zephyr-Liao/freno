import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import type { CommitConfig } from '../types.js';
import { collectCommitConfig } from '../prompts/commit.js';
import { generateCommitlintConfig } from '../generators/commitlint.js';
import { updateTargetPackageJson } from '../utils/package.js';
import { initHusky } from '../utils/husky.js';

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
  // 检测项目模块类型
  const moduleType = await detectModuleType(targetDir);
  
  // 根据模块类型生成不同的配置文件
  // ES Module 项目使用 .cjs 扩展名，CommonJS 使用 .js
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

  // 更新 package.json（先更新，以便 husky 依赖已添加）
  await updateTargetPackageJson(targetDir, config);

  // 如果使用 husky，初始化 husky 并创建 hook
  if (config.useHusky) {
    await initHusky(targetDir);
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

