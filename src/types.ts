export interface EmojiMapping {
  emoji: string;
  type: string;
}

export interface CommitConfig {
  emojiMappings: EmojiMapping[];
  useHusky: boolean;
  useGitmojiCli: boolean;
  useCommitizen: boolean;
}

