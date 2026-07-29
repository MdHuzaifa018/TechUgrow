const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const outputFile = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\490ad350-f16d-478d-a012-714e45dad140\\ultimate_complete_code.md';

const directoriesToScan = [
  'server/index.js',
  'server/seed.js',
  'server/middleware',
  'server/models',
  'server/routes',
  'client/src/App.jsx',
  'client/src/api/index.js',
  'client/src/pages/Admin.jsx',
  'client/src/pages/AdminLayout.jsx',
  'client/src/pages/admin',
  'client/src/pages',
  'client/src/components'
];

let markdownContent = `# 🚀 DIGITALIZEU - ULTIMATE COMPLETE SOURCE CODE
This document contains the 100% complete source code for every single file in the DigitalizeU project, extracted directly from the working repository. You can use this as an absolute reference to build the website from scratch.

`;

function readFilesRecursively(targetPath) {
  const fullPath = path.join(projectRoot, targetPath);
  
  if (!fs.existsSync(fullPath)) return;

  const stat = fs.statSync(fullPath);

  if (stat.isFile()) {
    if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      markdownContent += `\n## 📄 File: \`${targetPath}\`\n\n`;
      markdownContent += '```javascript\n';
      markdownContent += content;
      markdownContent += '\n```\n\n';
      markdownContent += '---\n';
    }
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
      // Avoid infinite recursion or massive unneeded folders
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        readFilesRecursively(path.posix.join(targetPath, file));
      }
    }
  }
}

for (const target of directoriesToScan) {
  markdownContent += `\n# 📁 SECTION: ${target.toUpperCase()}\n`;
  readFilesRecursively(target);
}

fs.writeFileSync(outputFile, markdownContent);
console.log('Complete code documentation generated successfully at:', outputFile);
