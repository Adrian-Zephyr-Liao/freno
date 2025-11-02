const emojiToTypeMap = {
  ":sparkles:": "feat",
  ":bug:": "fix",
  ":memo:": "docs",
  ":art:": "style",
  ":recycle:": "refactor",
  ":zap:": "perf",
  ":white_check_mark:": "test",
  ":wrench:": "chore",
  ":rewind:": "revert",
  ":package:": "build",
  ":construction_worker:": "ci",
  ":construction:": "wip",
  ":bookmark:": "release",
  ":arrow_up:": "deps"
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(:sparkles:|:bug:|:memo:|:art:|:recycle:|:zap:|:white_check_mark:|:wrench:|:rewind:|:package:|:construction_worker:|:construction:|:bookmark:|:arrow_up:)\s+(\w+):\s+(.+)$/,
      headerCorrespondence: ['emoji', 'type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'emoji-type-match': (parsed) => {
          const emoji = parsed.emoji;
          const type = parsed.type;
          
          if (!emoji || !type) {
            return [false, '提交信息格式错误：缺少 emoji 或 type'];
          }
          
          const expectedType = emojiToTypeMap[emoji];
          if (!expectedType) {
            return [false, `未知的 emoji: ${emoji}`];
          }
          
          if (expectedType !== type) {
            return [false, `emoji ${emoji} 对应的 type 应该是 ${expectedType}，但当前是 ${type}`];
          }
          
          return [true];
        },
      },
    },
  ],
  rules: {
    // type 枚举验证
    'type-enum': [
      2,
      'always',
      ["feat","fix","docs","style","refactor","perf","test","chore","revert","build","ci","wip","release","deps"],
    ],
    // type 不能为空
    'type-empty': [2, 'never'],
    // subject 不能为空
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // scope 不使用
    'scope-empty': [0, 'always'],
    // 验证 emoji 和 type 的映射关系
    'emoji-type-match': [2, 'always'],
  },
};

