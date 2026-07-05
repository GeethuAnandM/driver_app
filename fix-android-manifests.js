const fs = require('fs');
const path = require('path');

function listPackageDirs(nodeModulesDir) {
  const dirs = [];
  for (const entry of fs.readdirSync(nodeModulesDir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(nodeModulesDir, entry);
    if (!fs.statSync(full).isDirectory()) continue;
    if (entry.startsWith('@')) {
      for (const sub of fs.readdirSync(full)) {
        dirs.push(path.join(full, sub));
      }
    } else {
      dirs.push(full);
    }
  }
  return dirs;
}

const nodeModules = path.join(__dirname, 'node_modules');
const patched = [];
const needsManual = [];

for (const pkgDir of listPackageDirs(nodeModules)) {
  const manifestPath = path.join(pkgDir, 'android/src/main/AndroidManifest.xml');
  if (!fs.existsSync(manifestPath)) continue;

  const manifest = fs.readFileSync(manifestPath, 'utf8');
  const tagMatch = manifest.match(/<manifest\b[^>]*>/);
  if (!tagMatch || tagMatch[0].includes('package=')) continue; // already fine

  const gradlePath = path.join(pkgDir, 'android/build.gradle');
  if (!fs.existsSync(gradlePath)) { needsManual.push(pkgDir); continue; }

  const gradle = fs.readFileSync(gradlePath, 'utf8');
  const nsMatch = gradle.match(/namespace\s*=?\s*["']([\w.]+)["']/);
  if (!nsMatch) { needsManual.push(pkgDir); continue; }

  const newTag = tagMatch[0].replace('<manifest', `<manifest package="${nsMatch[1]}"`);
  fs.writeFileSync(manifestPath, manifest.replace(tagMatch[0], newTag));
  patched.push(path.relative(nodeModules, pkgDir));
}

console.log('✅ Patched (' + patched.length + '):', patched);
console.log('⚠️  Needs manual review:', needsManual);