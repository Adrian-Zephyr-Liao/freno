#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { selectConfigType } from './prompts/init.js';

// CLI 命令
program
  .name('freno')
  .description('快速创建项目相关约束配置的工具')
  .version('1.0.0');

program
  .command('init')
  .description('初始化项目配置')
  .action(async () => {
    try {
      await selectConfigType();
    } catch (error) {
      console.error(chalk.red(`错误: ${error}`));
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();
