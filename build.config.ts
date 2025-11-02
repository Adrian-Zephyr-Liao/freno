import { defineBuildConfig } from 'unbuild';
import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'build:done': () => {
      // 复制模板文件到 dist 目录
      const srcTemplatePath = 'src/templates/commitlint.config.hbs';
      const distTemplateDir = 'dist/templates';
      const distTemplatePath = join(distTemplateDir, 'commitlint.config.hbs');
      
      if (existsSync(srcTemplatePath)) {
        // 确保目录存在
        mkdirSync(distTemplateDir, { recursive: true });
        // 复制模板文件
        copyFileSync(srcTemplatePath, distTemplatePath);
        console.log(`✓ 已复制模板文件到 ${distTemplatePath}`);
      }
    },
  },
});

