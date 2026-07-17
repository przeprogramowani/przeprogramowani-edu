import fs from 'fs';
import path from 'path';

const addon = `
const When = {
    Client: 'client',
    Server: 'server',
    Prerender: 'prerender',
    StaticBuild: 'staticBuild',
    DevServer: 'devServer',
}

const whenAmI = When;
`;

try {
  const fileContent = fs.readFileSync(
    path.join(
      new URL('.', import.meta.url).pathname,
      '../../node_modules/@astrojs/cloudflare/dist/entrypoints/middleware.js'
    ),
    'utf8'
  );

  if (fileContent.includes('@it-astro:when')) {
    const lines = fileContent.split('\n');
    const filteredLines = lines.filter((line) => !line.includes('@it-astro:when'));

    const newContent = addon + '\n' + filteredLines.join('\n');

    fs.writeFileSync(
      path.join(
        new URL('.', import.meta.url).pathname,
        '../../node_modules/@astrojs/cloudflare/dist/entrypoints/middleware.js'
      ),
      newContent,
      'utf8'
    );
  }
} catch (error) {
  console.error('Error occurred:', error);

  const basePath = path.join(new URL('.', import.meta.url).pathname, '../../');

  console.log('\nChecking directory contents:');

  // Check node_modules
  console.log('\nnode_modules content:');
  try {
    console.log(fs.readdirSync(path.join(basePath, 'node_modules')));
  } catch (e) {
    console.log('Unable to read node_modules:', e.message);
  }

  // Check @astrojs
  console.log('\n@astrojs content:');
  try {
    console.log(fs.readdirSync(path.join(basePath, 'node_modules/@astrojs')));
  } catch (e) {
    console.log('Unable to read @astrojs:', e.message);
  }

  // Check cloudflare folder
  console.log('\n@astrojs/cloudflare content:');
  try {
    console.log(fs.readdirSync(path.join(basePath, 'node_modules/@astrojs/cloudflare')));
  } catch (e) {
    console.log('Unable to read @astrojs/cloudflare:', e.message);
  }
}
