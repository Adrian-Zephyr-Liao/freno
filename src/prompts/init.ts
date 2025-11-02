import inquirer from 'inquirer';
import { setupCommitConfig } from '../commands/commit.js';

// 选择要配置的内容
export async function selectConfigType(): Promise<void> {
  const { configType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'configType',
      message: '请选择要配置的内容:',
      choices: [
        { name: 'Git 提交规范', value: 'commit' },
        // 后续可以添加更多选项，如:
        // { name: 'ESLint 配置', value: 'eslint' },
        // { name: 'Prettier 配置', value: 'prettier' },
      ],
    },
  ]);

  switch (configType) {
    case 'commit':
      await setupCommitConfig();
      break;
    // 后续可以添加更多配置类型
    // case 'eslint':
    //   await setupEslintConfig();
    //   break;
    default:
      console.log('暂不支持该配置类型');
      break;
  }
}

