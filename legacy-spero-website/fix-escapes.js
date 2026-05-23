const fs = require('fs');
const path = require('path');
const filePaths = [
    '../brunswick-pt/app/admin/lean/5s/executar/page.tsx',
    '../brunswick-pt/app/admin/lean/5s/setup/page.tsx'
];

for (const filePath of filePaths) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\\\$\{/g, '${');
    fs.writeFileSync(filePath, content);
}
console.log("Replaced all occurrences successfully");
