import type { CommitConfig } from '../types.js';

// 生成 cz-customizable 配置文件
export function generateCzConfig(config: CommitConfig): string {
  const types = config.emojiMappings.map((m) => ({
    value: m.type,
    name: `${m.type}: ${m.emoji} ${getEmojiDescription(m.emoji)}`,
  }));

  // 创建 emoji 映射，用于格式化提交信息
  const emojiMap = config.emojiMappings.reduce(
    (acc, m) => {
      acc[m.type] = m.emoji;
      return acc;
    },
    {} as Record<string, string>
  );

  // 使用 .cjs 扩展名以避免 ES Module 冲突
  // cz-customizable 会自动查找 .cz-config.js 或 .cz-config.cjs
  return `module.exports = {
  types: ${JSON.stringify(types, null, 2)},
  skipQuestions: ['scope', 'body', 'footer'],
  messages: {
    type: '选择提交类型:',
    subject: '输入提交描述:',
  },
  subjectLimit: 100,
  // 自定义提交信息格式: :emoji: type: description
  // 注意: cz-customizable 会通过回调函数接收答案，我们需要在最终提交时格式化
  // 这里使用 formatCommitMessage 选项（如果支持）或者通过 transform
  // 实际上，cz-customizable 不直接支持自定义格式，我们需要在 commitlint 验证时统一格式
  // 但我们可以通过自定义 adapter 或者在提交前处理来实现
  // 这里我们简化处理，在 type 选择时就包含 emoji
  typesPrefix: '',
  // 不在这里格式化，由 commitlint 验证时统一处理格式
};
`;
}

// 获取 emoji 的描述（简化版）
function getEmojiDescription(emoji: string): string {
  const descriptions: Record<string, string> = {
    ':sparkles:': '新功能',
    ':bug:': '修复 bug',
    ':memo:': '文档更新',
    ':art:': '代码格式调整',
    ':recycle:': '代码重构',
    ':zap:': '性能优化',
    ':white_check_mark:': '添加或修改测试',
    ':wrench:': '构建过程或辅助工具的变动',
    ':rewind:': '回滚提交',
    ':package:': '构建相关的修改',
    ':construction_worker:': 'CI 相关的修改',
    ':construction:': '进行中的工作',
    ':bookmark:': '发布新版本',
    ':arrow_up:': '升级依赖',
  };
  return descriptions[emoji] || '其他';
}

