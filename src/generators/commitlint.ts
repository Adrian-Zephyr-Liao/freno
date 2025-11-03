import Handlebars from 'handlebars';
import type { TemplateDelegate } from 'handlebars';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import type { CommitConfig } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadTemplate(): TemplateDelegate {
  const distTemplatePath = join(__dirname, './templates/commitlint.config.hbs');
  const srcTemplatePath = join(__dirname, '../../src/templates/commitlint.config.hbs');
  const cwdTemplatePath = join(process.cwd(), 'dist/templates/commitlint.config.hbs');
  
  let templatePath: string;
  if (existsSync(distTemplatePath)) {
    templatePath = distTemplatePath;
  } else if (existsSync(cwdTemplatePath)) {
    templatePath = cwdTemplatePath;
  } else if (existsSync(srcTemplatePath)) {
    templatePath = srcTemplatePath;
  } else {
    throw new Error(`找不到模板文件 commitlint.config.hbs
尝试的路径：
  - ${distTemplatePath}
  - ${cwdTemplatePath}
  - ${srcTemplatePath}`);
  }
  
  const templateContent = readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateContent);
}

// 生成 commitlint 配置
export function generateCommitlintConfig(
  config: CommitConfig
): string {
  const emojiPattern = config.emojiMappings
    .map((m) => m.emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const typeEnum = config.emojiMappings.map((m) => m.type);

  const emojiToTypeMap: Record<string, string> = {};
  config.emojiMappings.forEach((m) => {
    emojiToTypeMap[m.emoji] = m.type;
  });

  const patternRegex = new RegExp(`^(${emojiPattern})\\s+(\\w+):\\s+(.+)$`);
  const patternString = patternRegex.toString();

  const template = loadTemplate();

  return template({
    emojiToTypeMap: JSON.stringify(emojiToTypeMap, null, 2),
    pattern: patternString,
    typeEnum: JSON.stringify(typeEnum),
  });
}

