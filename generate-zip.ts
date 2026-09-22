import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'achadinhos-shopee-completo.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`ZIP created successfully: ${archive.pointer()} total bytes at ${outputPath}`);
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outputPath, path.join(distDir, 'achadinhos-shopee-completo.zip'));
  }
});

archive.on('error', (err: any) => {
  throw err;
});

archive.pipe(output);

// Append files from project root
archive.glob('**/*', {
  cwd: rootDir,
  ignore: [
    'node_modules/**',
    '.git/**',
    'public/achadinhos-shopee-completo.zip',
    'dist/**',
    '*.tar.gz',
    'public/*.tar.gz'
  ],
  dot: true
});

archive.finalize();
