import { mkdir, writeFile, chmod } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import type { CommitConfig } from '../types.js';
import { generateCommitMsgHook } from '../generators/commit-msg-hook.js';

// 初始化 husky（husky v9+）
export async function initHusky(
  targetDir: string,
  config: CommitConfig
): Promise<void> {
  try {
    // 运行 husky 初始化（husky v9+ 只需要运行 npx husky）
    console.log(chalk.blue('正在初始化 Husky...'));
    execSync('npx husky', {
      cwd: targetDir,
      stdio: 'inherit',
    });

    // 手动创建 .husky 目录（如果不存在）
    const huskyDir = join(targetDir, '.husky');
    if (!existsSync(huskyDir)) {
      await mkdir(huskyDir, { recursive: true });
    }

          // 手动创建 commit-msg hook 文件
          console.log(chalk.blue('正在创建 commit-msg hook...'));
          const commitMsgPath = join(huskyDir, 'commit-msg');
          
          // 生成 hook 内容
          let commitMsgContent = '';
          
          // 如果使用 Commitizen，添加自动添加 emoji 的脚本
          if (config.useCommitizen) {
            const emojiHookScript = generateCommitMsgHook(config);
            // generateCommitMsgHook 已经包含了 commitlint 验证
            commitMsgContent += emojiHookScript;
          } else {
            // 如果不使用 Commitizen，只添加 commitlint 验证
            commitMsgContent += `npx --no-install commitlint --edit "$1"
`;
          }
          
          await writeFile(commitMsgPath, commitMsgContent, 'utf-8');

          // 设置执行权限
          await chmod(commitMsgPath, 0o755);

          if (config.useCommitizen) {
            console.log(
              chalk.green(
                '✓ 已初始化 Husky 并创建 commit-msg hook（包含自动添加 emoji 功能）'
              )
            );
          } else {
            console.log(chalk.green('✓ 已初始化 Husky 并创建 commit-msg hook'));
          }
  } catch (error) {
    console.log(
      chalk.yellow(
        '⚠ Husky 初始化可能失败，请确保项目已初始化 Git 仓库。错误:'
      )
    );
    console.log(chalk.red(String(error)));
    console.log(
      chalk.yellow(
        '提示: 如果 husky 未安装，请先运行 npm install 安装依赖'
      )
    );
  }
}

