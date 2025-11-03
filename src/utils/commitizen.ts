import chalk from 'chalk';

// 配置 Commitizen
export async function setupCommitizen(targetDir: string): Promise<void> {
  try {
    console.log(chalk.blue('\n正在配置 Commitizen...'));

    console.log(chalk.green('✓ Commitizen 和 cz-customizable 已添加到依赖'));
    console.log(chalk.green('✓ .cz-config.cjs 配置文件已创建'));
    console.log(
      chalk.yellow(
        '\n📝 使用说明:'
      )
    );
    console.log(
      chalk.cyan('  使用 Commitizen 进行交互式提交:')
    );
    console.log(
      chalk.white('    npm run cz')
    );
    console.log(
      chalk.white('    或: npm run commit')
    );
    console.log(
      chalk.white('    或: npx cz')
    );
    console.log(
      chalk.yellow('\n💡 工作流程:')
    );
    console.log(
      chalk.white('  1. 运行 npm run cz 启动交互式提交流程')
    );
    console.log(
      chalk.white('  2. 选择 type（会自动匹配对应的 emoji）')
    );
    console.log(
      chalk.white('  3. 输入提交描述')
    );
    console.log(
      chalk.white('  4. Git hook 会自动添加 emoji 前缀')
    );
    console.log(
      chalk.white('  5. commitlint 会验证提交信息格式')
    );
    console.log(
      chalk.yellow('\n✨ 提交格式: :emoji: type: description')
    );
  } catch (error) {
    console.log(chalk.yellow('⚠ Commitizen 配置提示失败'));
    console.log(chalk.red(String(error)));
  }
}

