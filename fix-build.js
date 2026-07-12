import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.mjs') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk('.output/server');
let patched = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('__commonJSMin(')) {
    // Inline the precise Rolldown polyfill directly into the call site
    content = content.replace(/__commonJSMin\(/g, '((cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports))(');
    fs.writeFileSync(file, content);
    patched++;
  }
});

console.log(`Patched ${patched} files to bypass Nitro __commonJSMin bug.`);
