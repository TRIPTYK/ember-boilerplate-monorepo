#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const testDir = path.join(__dirname, 'tests');
const outputFile = path.join(__dirname, 'src-packed.txt');

// Code file extensions to include
const codeExtensions = new Set([
  '.ts',
  '.gts',
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  '.tsx',
  '.json',
  '.hbs',
  '.handlebars'
]);

// Directories to exclude
const excludeDirs = new Set(['node_modules', 'dist', '.git', '.turbo']);

let outputContent = '';
let fileCount = 0;

/**
 * Recursively read all code files from a directory
 * @param {string} dir - Directory to read from
 * @param {string} relativeDir - Relative path for display
 */
function readFilesRecursive(dir, relativeDir = '') {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = relativeDir ? `${relativeDir}/${file}` : file;

    try {
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        if (!excludeDirs.has(file)) {
          readFilesRecursive(filePath, relativePath);
        }
      } else if (stats.isFile()) {
        const ext = path.extname(file);
        if (codeExtensions.has(ext)) {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            outputContent += `\n${'='.repeat(80)}\n`;
            outputContent += `FILE: ${relativePath}\n`;
            outputContent += `${'='.repeat(80)}\n\n`;
            outputContent += content;
            outputContent += '\n\n';
            fileCount++;
            console.log(`✓ Packed: ${relativePath}`);
          } catch (err) {
            console.error(`Error reading file ${relativePath}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error(`Error accessing ${relativePath}:`, err.message);
    }
  });
}

// Start packing files
console.log(`\n📦 Packing code files from: ${srcDir}\n`);

try {
  readFilesRecursive(srcDir);
  readFilesRecursive(testDir);

  // Add summary
  const separator = `${'='.repeat(80)}\n\n`;
  outputContent = separator + outputContent;

  // Write to output file
  fs.writeFileSync(outputFile, outputContent, 'utf-8');
  console.log(`\n✅ Successfully packed ${fileCount} files!`);
  console.log(`📄 Output file: ${outputFile}\n`);
} catch (err) {
  console.error('❌ Error during packing:', err.message);
  process.exit(1);
}
