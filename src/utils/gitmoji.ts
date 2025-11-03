import chalk from 'chalk';

// 配置 gitmoji-cli
export async function setupGitmojiCli(targetDir: string): Promise<void> {
  try {
    console.log(chalk.blue('\n正在配置 gitmoji-cli...'));

    // gitmoji-cli 的格式是 :emoji: subject
    // 我们的格式是 :emoji: type: description
    // 需要提示用户如何使用

    console.log(chalk.green('✓ gitmoji-cli 已添加到依赖'));
    console.log(
      chalk.yellow(
        '\n📝 使用说明:'
      )
    );
    console.log(
      chalk.cyan('  gitmoji-cli 生成的格式: :emoji: subject')
    );
    console.log(
      chalk.cyan('  我们的规范格式: :emoji: type: description')
    );
    console.log(
      chalk.yellow('\n💡 推荐使用方式:')
    );
    console.log(
      chalk.white('  1. 运行 npx gitmoji -c 选择 emoji 和输入描述')
    );
    console.log(
      chalk.white('  2. 在生成的提交信息前添加 type，格式为:')
    );
    console.log(
      chalk.white('     :emoji: type: description')
    );
    console.log(
      chalk.white('     例如: :sparkles: feat: 添加新功能')
    );
    console.log(
      chalk.yellow('\n✨ 或者直接手动输入符合规范的提交信息')
    );
    console.log(
      chalk.green('\n📋 提示: 已创建 .gitmessage 模板文件')
    );
    console.log(
      chalk.white('  运行 git commit 时会自动显示模板')
    );
    console.log(
      chalk.white('  可以使用 gitmoji-cli 选择 emoji，然后编辑为规范格式')
    );
  } catch (error) {
    console.log(chalk.yellow('⚠ gitmoji-cli 配置提示失败'));
    console.log(chalk.red(String(error)));
  }
}

