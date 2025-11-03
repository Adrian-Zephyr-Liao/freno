import type { CommitConfig } from '../types.js';

// 生成 Git 提交模板文件内容
export function generateGitMessage(config: CommitConfig): string {
  const emojiList = config.emojiMappings
    .map((m) => `  ${m.emoji}  ${m.type} - ${getEmojiDescription(m.emoji)}`)
    .join('\n');

  return `# Git 提交信息模板
# 
# 格式: :emoji: type: description
#
# 可用的 emoji 和对应的 type:
${emojiList}
#
# 示例:
#   :sparkles: feat: 添加新功能
#   :bug: fix: 修复问题
#   :memo: docs: 更新文档
#
# 使用 gitmoji-cli: npx gitmoji -c 选择 emoji，然后编辑为规范格式
#
# ---
# 请输入提交信息 (首行会被用作提交标题):
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

