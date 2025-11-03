import inquirer from 'inquirer';
import chalk from 'chalk';
import type { CommitConfig, EmojiMapping } from '../types.js';
import { defaultEmojiMappings } from '../constants.js';

// 自定义 emoji 映射
async function customizeEmojiMappings(
  defaultMappings: EmojiMapping[]
): Promise<EmojiMapping[]> {
  const mappings: EmojiMapping[] = [];
  let continueAdding = true;

  console.log(chalk.yellow('\n当前默认映射:'));
  defaultMappings.forEach((m) => {
    console.log(chalk.gray(`  ${m.emoji} -> ${m.type}`));
  });

  while (continueAdding) {
    const { emoji, type } = await inquirer.prompt([
      {
        type: 'input',
        name: 'emoji',
        message: '请输入 emoji 代码（如 :feat:）:',
        validate: (input: string) => {
          if (!input.startsWith(':') || !input.endsWith(':')) {
            return 'emoji 代码格式应为 :xxx:';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'type',
        message: '请输入对应的 type（如 feat）:',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'type 不能为空';
          }
          return true;
        },
      },
    ]);

    mappings.push({ emoji, type });

    const { continueAdding: continueInput } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: '是否继续添加更多映射?',
        default: false,
      },
    ]);

    continueAdding = continueInput;
  }

  // 合并默认映射和自定义映射
  const finalMappings = [...defaultMappings];
  mappings.forEach((custom) => {
    const existingIndex = finalMappings.findIndex(
      (m) => m.emoji === custom.emoji
    );
    if (existingIndex >= 0) {
      finalMappings[existingIndex] = custom;
    } else {
      finalMappings.push(custom);
    }
  });

  return finalMappings;
}

// 创建自定义 emoji 映射
async function createCustomEmojiMappings(): Promise<EmojiMapping[]> {
  const mappings: EmojiMapping[] = [];
  let continueAdding = true;

  while (continueAdding) {
    const { emoji, type } = await inquirer.prompt([
      {
        type: 'input',
        name: 'emoji',
        message: '请输入 emoji 代码（如 :feat:）:',
        validate: (input: string) => {
          if (!input.startsWith(':') || !input.endsWith(':')) {
            return 'emoji 代码格式应为 :xxx:';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'type',
        message: '请输入对应的 type（如 feat）:',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'type 不能为空';
          }
          return true;
        },
      },
    ]);

    mappings.push({ emoji, type });

    const { continueAdding: continueInput } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: '是否继续添加更多映射?',
        default: true,
      },
    ]);

    continueAdding = continueInput;
  }

  return mappings;
}

// 交互式配置收集
export async function collectCommitConfig(): Promise<CommitConfig> {
  console.log(chalk.blue('开始配置 Git 提交规范...\n'));

  const { useHusky } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useHusky',
      message: '是否使用 Husky 来管理 Git hooks?',
      default: true,
    },
  ]);

  const { useCommitizen } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useCommitizen',
      message: '是否安装 Commitizen (cz-customizable) 作为提交助手?',
      default: true,
    },
  ]);

  const { useDefaultEmoji } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDefaultEmoji',
      message: '是否使用默认 emoji 映射?',
      default: true,
    },
  ]);

  let emojiMappings: EmojiMapping[] = [];

  if (useDefaultEmoji) {
    const { customizeEmoji } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'customizeEmoji',
        message: '是否自定义 emoji 映射?',
        default: false,
      },
    ]);

    if (customizeEmoji) {
      emojiMappings = await customizeEmojiMappings(defaultEmojiMappings);
    } else {
      emojiMappings = defaultEmojiMappings;
    }
  } else {
    emojiMappings = await createCustomEmojiMappings();
  }

  return {
    emojiMappings,
    useHusky,
    useCommitizen,
  };
}

