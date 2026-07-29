const fs = require('fs');
const path = require('path');

const clientDir = __dirname;

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = findFiles(clientDir);

for (const file of allFiles) {
  // Skip config files
  if (file.includes('config.js') || file.includes('migrate.js') || file.includes('layout.js') || file.includes('page.js')) {
      if(!file.includes('components') && !file.includes('sections') && !file.includes('utils') && !file.includes('app')){
          continue;
      }
  }
  
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('from "react"') || content.includes('from \'react\'') || content.includes('<') && content.includes('/>') || content.includes('</')) {
      const newFile = file.replace(/\.js$/, '.jsx');
      fs.renameSync(file, newFile);
  }
}

console.log('Rename script complete.');
