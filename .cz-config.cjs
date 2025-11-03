module.exports = {
  types: [
  {
    "value": "feat",
    "name": "feat: :sparkles: 新功能"
  },
  {
    "value": "fix",
    "name": "fix: :bug: 修复 bug"
  },
  {
    "value": "docs",
    "name": "docs: :memo: 文档更新"
  },
  {
    "value": "style",
    "name": "style: :art: 代码格式调整"
  },
  {
    "value": "refactor",
    "name": "refactor: :recycle: 代码重构"
  },
  {
    "value": "perf",
    "name": "perf: :zap: 性能优化"
  },
  {
    "value": "test",
    "name": "test: :white_check_mark: 添加或修改测试"
  },
  {
    "value": "chore",
    "name": "chore: :wrench: 构建过程或辅助工具的变动"
  },
  {
    "value": "revert",
    "name": "revert: :rewind: 回滚提交"
  },
  {
    "value": "build",
    "name": "build: :package: 构建相关的修改"
  },
  {
    "value": "ci",
    "name": "ci: :construction_worker: CI 相关的修改"
  },
  {
    "value": "wip",
    "name": "wip: :construction: 进行中的工作"
  },
  {
    "value": "release",
    "name": "release: :bookmark: 发布新版本"
  },
  {
    "value": "deps",
    "name": "deps: :arrow_up: 升级依赖"
  }
],
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
