import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import latestVersion from 'latest-version';
import whichPMRuns from 'which-pm-runs';
import type { CommitConfig } from '../types.js';

// 检测包管理器（完全依赖 which-pm-runs）
function detectPackageManager(): string {
  try {
    const pm = whichPMRuns();
    if (pm?.name) {
      // which-pm-runs 返回的名称可能是 'npm', 'yarn', 'pnpm', 'bun' 等
      const pmName = pm.name.toLowerCase();
      // 验证返回的包管理器是否被支持
      if (['npm', 'yarn', 'pnpm'].includes(pmName)) {
        return pmName;
      }
    }
  } catch (error) {
    // 如果检测失败，静默忽略
  }

  // 兜底：默认返回 npm
  return 'npm';
}

// 获取包的最新版本
async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const version = await latestVersion(packageName);
    return `^${version}`;
  } catch (error) {
    console.log(
      chalk.yellow(`⚠ 无法获取 ${packageName} 的最新版本，使用默认版本`)
    );
    // 返回默认版本
    const defaultVersions: Record<string, string> = {
      '@commitlint/cli': '^18.4.4',
      '@commitlint/config-conventional': '^18.4.4',
      husky: '^9.0.0',
    };
    return defaultVersions[packageName] || 'latest';
  }
}

// 获取安装命令
function getInstallCommand(pm: string): string {
  const commands: Record<string, string> = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };
  return commands[pm] || 'npm install';
}

// 更新目标项目的 package.json
export async function updateTargetPackageJson(
  targetDir: string,
  config: CommitConfig
): Promise<void> {
  const packageJsonPath = join(targetDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    console.log(
      chalk.yellow('未找到 package.json，将跳过依赖更新')
    );
    return;
  }

  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    // 添加依赖
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }

    // 获取最新版本
    console.log(chalk.blue('正在获取依赖的最新版本...'));
    const commitlintCliVersion = await getLatestVersion('@commitlint/cli');
    const commitlintConfigVersion = await getLatestVersion(
      '@commitlint/config-conventional'
    );

    packageJson.devDependencies['@commitlint/cli'] = commitlintCliVersion;
    packageJson.devDependencies[
      '@commitlint/config-conventional'
    ] = commitlintConfigVersion;

    if (config.useHusky) {
      const huskyVersion = await getLatestVersion('husky');
      packageJson.devDependencies['husky'] = huskyVersion;
    }

    if (config.useCommitizen) {
      const commitizenVersion = await getLatestVersion('commitizen');
      const czCustomizableVersion = await getLatestVersion('cz-customizable');
      packageJson.devDependencies['commitizen'] = commitizenVersion;
      packageJson.devDependencies['cz-customizable'] = czCustomizableVersion;
    }

    // 添加 scripts
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    if (config.useHusky) {
      packageJson.scripts['prepare'] = 'husky';
    }

    if (config.useCommitizen) {
      // 配置 commitizen 使用 cz-customizable
      if (!packageJson.config) {
        packageJson.config = {};
      }
      packageJson.config.commitizen = {
        path: './node_modules/cz-customizable',
      };
      // 明确指定 cz-customizable 配置文件路径（根据文档）
      // 使用 .cjs 扩展名以避免 ES Module 冲突
      packageJson.config['cz-customizable'] = {
        config: '.cz-config.cjs',
      };
      // 添加 cz 脚本别名
      packageJson.scripts['cz'] = 'cz';
      packageJson.scripts['commit'] = 'cz';
    }

    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );

    // 检测包管理器
    const pm = detectPackageManager();
    const installCommand = getInstallCommand(pm);

    console.log(
      chalk.green('✓ 已更新 package.json，添加了必要的依赖和 scripts')
    );
    console.log(
      chalk.blue(`\n检测到包管理器: ${chalk.bold(pm)}`)
    );
    console.log(
      chalk.yellow(`\n请运行以下命令安装依赖:\n  ${installCommand}`)
    );
  } catch (error) {
    console.log(chalk.red(`更新 package.json 失败: ${error}`));
  }
}

