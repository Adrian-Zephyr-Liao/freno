import type { CommitConfig } from '../types.js';
import { getEmojiDescription } from '../constants.js';

// 生成 cz-customizable 配置文件
export function generateCzConfig(config: CommitConfig): string {
  const types = config.emojiMappings.map((m) => ({
    value: m.type,
    name: `${m.type}: ${m.emoji} ${getEmojiDescription(m.emoji)}`,
  }));

  return `module.exports = {
  types: ${JSON.stringify(types, null, 2)},
  skipQuestions: ['scope', 'body', 'footer'],
  messages: {
    type: '选择提交类型:',
    subject: '输入提交描述:',
  },
  subjectLimit: 100,
};
`;
}

