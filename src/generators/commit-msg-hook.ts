import type { CommitConfig } from '../types.js';

export function generateCommitMsgHook(config: CommitConfig): string {
  const emojiCases = config.emojiMappings
    .map((m) => `    "${m.type}") emoji="${m.emoji}" ;;`)
    .join('\n');

  return `#!/bin/sh
commitMsgFile="$1"
firstLine=$(head -n 1 "$commitMsgFile")

if echo "$firstLine" | grep -qE '^:[^:]+:\\s+\\w+:'; then
  :
elif echo "$firstLine" | grep -qE '^\\w+\\s*:\\s*'; then
  type=$(echo "$firstLine" | sed -E 's/^([^:]+):.*$/\\1/' | xargs)
  emoji=""
  case "$type" in
${emojiCases}
    *) emoji="" ;;
  esac
  
  if [ -n "$emoji" ]; then
    newFirstLine="$emoji $firstLine"
    if [ "$(uname)" = "Darwin" ]; then
      sed -i '' "1s|.*|$newFirstLine|" "$commitMsgFile"
    else
      sed -i "1s|.*|$newFirstLine|" "$commitMsgFile"
    fi
    echo "✓ 已自动添加 emoji 前缀: $emoji" >&2
  fi
fi

npx --no-install commitlint --edit "$1"
`;
}
