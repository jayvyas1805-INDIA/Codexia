#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile() && full.endsWith('.ts')) {
      if (full.endsWith('.d.ts')) continue;
      if (path.basename(full).startsWith('vite.config')) continue;
      out.push(full);
    }
  }
  return out;
}

const repoRoot = path.resolve(__dirname, '..');
const targets = [path.join(repoRoot, 'client'), path.join(repoRoot, 'shared'), path.join(repoRoot, 'server')];

let files = [];
for (const t of targets) {
  files = files.concat(walk(t));
}

console.log(`Found ${files.length} .ts files to convert`);

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(src, {
    fileName: file,
    compilerOptions: {
      jsx: ts.JsxEmit.None,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
    },
  });

  const outPath = file.replace(/\.ts$/, '.js');
  const backupPath = file + '.bak';

  try {
    fs.renameSync(file, backupPath);
  } catch (err) {
    console.error('Failed to backup', file, err);
    continue;
  }

  fs.writeFileSync(outPath, result.outputText, 'utf8');
  console.log(`Converted: ${file} -> ${outPath} (backup: ${backupPath})`);
}

console.log('TypeScript -> JS conversion complete.');
