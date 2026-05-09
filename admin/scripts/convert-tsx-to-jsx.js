#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const repoRoot = path.resolve(__dirname, '..');
const clientDir = path.join(repoRoot, 'client');
const tsxFiles = walk(clientDir);

console.log(`Found ${tsxFiles.length} .tsx files under ${clientDir}`);

if (tsxFiles.length === 0) process.exit(0);

for (const file of tsxFiles) {
  const src = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(src, {
    fileName: file,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
    },
  });

  const outPath = file.replace(/\.tsx$/, '.jsx');
  const backupPath = file + '.bak';

  // keep a backup of original file
  try {
    fs.renameSync(file, backupPath);
  } catch (err) {
    console.error('Failed to backup', file, err);
    continue;
  }

  fs.writeFileSync(outPath, result.outputText, 'utf8');
  console.log(`Converted: ${file} -> ${outPath} (backup: ${backupPath})`);
}

console.log('Conversion complete. You can remove .bak files after verification.');