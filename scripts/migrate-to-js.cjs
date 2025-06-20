const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function updateImports(code) {
  return code
    .replace(/(from\s+['\"].*?)\.tsx(['\"])/g, '$1.jsx$2')
    .replace(/(from\s+['\"].*?)\.ts(['\"])/g, '$1.js$2');
}

function convertFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = updateImports(source);
  const result = ts.transpileModule(updated, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
    },
  });
  const ext = path.extname(filePath);
  const newExt = ext === '.tsx' ? '.jsx' : '.js';
  const newPath = filePath.replace(ext, newExt);
  fs.writeFileSync(newPath, result.outputText);
  fs.unlinkSync(filePath);
  console.log(`Converted ${filePath} -> ${newPath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(tsx|ts)$/.test(entry) && !entry.endsWith('.d.ts')) {
      convertFile(fullPath);
    }
  });
}

walk(srcDir);

['vite.config.ts'].forEach((config) => {
  const configPath = path.join(projectRoot, config);
  if (fs.existsSync(configPath)) {
    convertFile(configPath);
  }
});
