import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 [Auto-Deploy] Starting automated build and deployment...');

// 1. Ensure dev index.html exists for Vite build
const devHtml = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WorkPredict Pro - Employee Productivity Analytics</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#070d1e] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white transition-colors duration-200">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), devHtml, 'utf8');

// 2. Build production assets
console.log('📦 [Auto-Deploy] Compiling TypeScript and bundling with Vite...');
execSync('npm.cmd run build', { cwd: rootDir, stdio: 'inherit' });

// 3. Inline into standalone single-file bundle
console.log('📄 [Auto-Deploy] Inlining CSS and JS into self-contained HTML...');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  throw new Error('Could not find built assets in dist/assets!');
}

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
const js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

const bundleHtml = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WorkPredict Pro - Employee Productivity Analytics</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
${css}
    </style>
  </head>
  <body class="bg-[#070d1e] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white transition-colors duration-200">
    <div id="root"></div>
    <script type="module">
${js}
    </script>
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'standalone_index.html'), bundleHtml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'index.html'), bundleHtml, 'utf8');

// Also copy to Desktop if exists
const desktopPath = path.join(process.env.USERPROFILE || '', 'OneDrive', 'Desktop', 'index.html');
try {
  fs.writeFileSync(desktopPath, bundleHtml, 'utf8');
} catch (e) {}

console.log('✅ [Auto-Deploy] Inlined bundle generated successfully!');

// 4. Commit and Push to GitHub
console.log('🌐 [Auto-Deploy] Pushing directly to GitHub...');
try {
  const githubDir = path.join(rootDir, '.github');
  if (fs.existsSync(githubDir)) {
    fs.rmSync(githubDir, { recursive: true, force: true });
  }
  execSync('git add -A', { cwd: rootDir, stdio: 'inherit' });
  try {
    execSync('git commit -m "deploy: automated dashboard update"', { cwd: rootDir, stdio: 'inherit' });
  } catch (e) {
    console.log('No new changes to commit.');
  }
  execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
  console.log('🎉 [Auto-Deploy] SUCCESS! GitHub Pages has been updated automatically!');
} catch (err) {
  console.error('⚠️ [Auto-Deploy] Git push requires one-time authentication.');
  throw err;
}
