import type { EmojiMapping } from './types.js';

// 默认 emoji 映射（基于 gitmoji 标准）
export const defaultEmojiMappings: EmojiMapping[] = [
  { emoji: ':sparkles:', type: 'feat' }, // ✨ 新功能
  { emoji: ':bug:', type: 'fix' }, // 🐛 修复 bug
  { emoji: ':memo:', type: 'docs' }, // 📝 文档更新
  { emoji: ':art:', type: 'style' }, // 🎨 代码格式调整
  { emoji: ':recycle:', type: 'refactor' }, // ♻️ 代码重构
  { emoji: ':zap:', type: 'perf' }, // ⚡️ 性能优化
  { emoji: ':white_check_mark:', type: 'test' }, // ✅ 添加或修改测试
  { emoji: ':wrench:', type: 'chore' }, // 🔧 构建过程或辅助工具的变动
  { emoji: ':rewind:', type: 'revert' }, // ⏪ 回滚提交
  { emoji: ':package:', type: 'build' }, // 📦 构建相关的修改
  { emoji: ':construction_worker:', type: 'ci' }, // 👷 CI 相关的修改
  { emoji: ':construction:', type: 'wip' }, // 🚧 进行中的工作
  { emoji: ':bookmark:', type: 'release' }, // 🔖 发布新版本
  { emoji: ':arrow_up:', type: 'deps' }, // ⬆️ 升级依赖
];

// 获取 emoji 的描述
export function getEmojiDescription(emoji: string): string {
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

