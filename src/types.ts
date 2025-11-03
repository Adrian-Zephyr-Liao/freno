export interface EmojiMapping {
  emoji: string;
  type: string;
}

export interface CommitConfig {
  emojiMappings: EmojiMapping[];
  useHusky: boolean;
  useCommitizen: boolean;
}

