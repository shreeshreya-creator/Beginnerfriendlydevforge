import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new JSZip();

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.aistudio',
  'cypress/screenshots',
  '.qodo',
]);

const IGNORED_FILES = new Set([
  'devforge-source-code.zip',
]);

function addDirectoryToZip(currentDir, relativePath = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const zipPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name) || IGNORED_DIRS.has(zipPath)) {
        continue;
      }
      addDirectoryToZip(fullPath, zipPath);
    } else if (entry.isFile()) {
      // Exclude existing zip archives or ignored files
      if (entry.name.endsWith('.zip') || IGNORED_FILES.has(entry.name)) {
        continue;
      }
      const fileData = fs.readFileSync(fullPath);
      zip.file(zipPath, fileData);
    }
  }
}

console.log('Packaging DevForge project files...');
addDirectoryToZip(rootDir);

const outputPath = path.join(publicDir, 'devforge-source-code.zip');
console.log('Writing zip to:', outputPath);

const content = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 },
});

fs.writeFileSync(outputPath, content);
console.log(`Successfully generated devforge-source-code.zip (${(content.length / 1024).toFixed(1)} KB)`);
