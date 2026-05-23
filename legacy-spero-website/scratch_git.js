const { execSync } = require('child_process');
try {
    console.log(execSync('git checkout -- app/admin/rh/page.tsx app/admin/rh/cadastro/page.tsx', { cwd: '../brunswick-pt', encoding: 'utf-8' }));
    console.log(execSync('git status', { cwd: '../brunswick-pt', encoding: 'utf-8' }));
} catch (e) {
    console.error(e.message);
}
