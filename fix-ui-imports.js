const fs = require('fs');
const path = require('path');

const uiSrcDir = path.join(__dirname, 'packages', 'ui', 'src');

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(fullPath));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

const files = walkDir(uiSrcDir);
let totalFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  // Replace @/xxx imports with relative paths
  content = content.replace(/from ["']@\/(.*?)["']/g, (match, importPath) => {
    const fileDir = path.dirname(file);
    const targetPath = path.join(uiSrcDir, importPath);
    let relativePath = path.relative(fileDir, targetPath).replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
    return `from "${relativePath}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    totalFixed++;
    console.log('Fixed:', path.relative(__dirname, file));
  }
}
console.log('Total files fixed:', totalFixed);
