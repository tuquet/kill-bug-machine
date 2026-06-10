const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const uiDir = path.join(__dirname, 'packages/ui/src');

walkDir(uiDir, function (filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');

    // determine relative depth from src
    let relativeFromSrc = path.relative(uiDir, path.dirname(filePath));
    let depth = relativeFromSrc === '' ? 0 : relativeFromSrc.split(path.sep).length;

    let prefix = depth === 0 ? './' : '../'.repeat(depth);

    let changed = false;

    let newContent = content.replace(/@\/components\/ui\//g, prefix + 'components/ui/');
    newContent = newContent.replace(/@\/lib\/utils/g, prefix + 'lib/utils');
    newContent = newContent.replace(/@\/hooks\/use-mobile/g, prefix + 'hooks/use-mobile');
    newContent = newContent.replace(/@\/components\/ui/g, prefix + 'components/ui');

    // Edge case if depth was 0, we might get `./components/ui/button` but maybe we want to keep it simple.

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed imports in ' + filePath);
    }
  }
});
