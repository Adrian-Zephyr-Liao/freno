import Handlebars from 'handlebars';
import type { TemplateDelegate } from 'handlebars';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import type { CommitConfig } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载模板文件（统一使用模板文件，不包含内嵌模板）
function loadTemplate(): TemplateDelegate {
  // 构建后的文件在 dist 目录，模板文件在 dist/templates/
  const distTemplatePath = join(__dirname, './templates/commitlint.config.hbs');
  // 从源码目录加载（开发环境或未构建的情况）
  const srcTemplatePath = join(__dirname, '../../src/templates/commitlint.config.hbs');
  // 从工作目录加载（作为备选）
  const cwdTemplatePath = join(process.cwd(), 'dist/templates/commitlint.config.hbs');
  
  let templatePath: string;
  if (existsSync(distTemplatePath)) {
    // 优先使用相对于构建文件的路径（生产环境）
    templatePath = distTemplatePath;
  } else if (existsSync(cwdTemplatePath)) {
    // 使用工作目录下的路径
    templatePath = cwdTemplatePath;
  } else if (existsSync(srcTemplatePath)) {
    // 使用源码路径（开发环境）
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
  // 转义 emoji 代码中的特殊字符，用于正则表达式
  const emojiPattern = config.emojiMappings
    .map((m) => m.emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const typeEnum = config.emojiMappings.map((m) => m.type);

  // 创建 emoji 到 type 的映射对象
  const emojiToTypeMap: Record<string, string> = {};
  config.emojiMappings.forEach((m) => {
    emojiToTypeMap[m.emoji] = m.type;
  });

  // 构建正则表达式：emoji-code: type: description（不支持 scope）
  // 格式: :emoji: type: description
  // 注意：emoji 匹配包含冒号，所以后面不需要再加冒号
  const patternRegex = new RegExp(`^(${emojiPattern})\\s+(\\w+):\\s+(.+)$`);
  // 转换为字符串用于模板（模板中使用 {{{pattern}}} 会输出字符串表示）
  const patternString = patternRegex.toString();

  const template = loadTemplate();

  return template({
    emojiToTypeMap: JSON.stringify(emojiToTypeMap, null, 2),
    pattern: patternString,
    typeEnum: JSON.stringify(typeEnum),
  });
}

