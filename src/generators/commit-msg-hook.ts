import type { CommitConfig } from '../types.js';

// 生成 commit-msg hook 脚本（用于自动添加 emoji 前缀）
export function generateCommitMsgHook(config: CommitConfig): string {
  // 创建 emoji 到 type 的映射，转换为 shell 脚本中的 case 语句更可靠
  const emojiCases = config.emojiMappings
    .map((m) => `    "${m.type}") emoji="${m.emoji}" ;;`)
    .join('\n');

  return `#!/bin/sh
# 自动添加 emoji 前缀的 Git hook
# 如果提交信息格式是 "type: description"，自动添加对应的 emoji

commitMsgFile="$1"

# 读取提交信息的第一行（提交标题）
firstLine=$(head -n 1 "$commitMsgFile")

# 检查是否已经包含 emoji（格式: :emoji: type: description）
if echo "$firstLine" | grep -qE '^:[^:]+:\\s+\\w+:'; then
  # 已经包含 emoji，不需要处理，但继续执行 commitlint 验证
  :
# 检查是否是 "type: description" 格式
elif echo "$firstLine" | grep -qE '^\\w+\\s*:\\s*'; then
  # 提取 type（第一个单词，冒号之前）
  type=$(echo "$firstLine" | sed -E 's/^([^:]+):.*$/\\1/' | xargs)
  
  # 查找对应的 emoji
  emoji=""
  case "$type" in
${emojiCases}
    *) emoji="" ;;
  esac
  
  if [ -n "$emoji" ]; then
    # 添加 emoji 前缀，格式: :emoji: type: description
    newFirstLine="$emoji $firstLine"
    
    # 替换第一行（兼容 macOS 和 Linux）
    if [ "$(uname)" = "Darwin" ]; then
      sed -i '' "1s|.*|$newFirstLine|" "$commitMsgFile"
    else
      sed -i "1s|.*|$newFirstLine|" "$commitMsgFile"
    fi
    
    # 提示信息（输出到 stderr，不写入提交信息）
    echo "✓ 已自动添加 emoji 前缀: $emoji" >&2
  fi
fi

# 执行 commitlint 验证（无论是否添加了 emoji）
npx --no-install commitlint --edit "$1"
`;
}
