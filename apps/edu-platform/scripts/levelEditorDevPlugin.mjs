import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LEVELS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../src/explorers/levels');
const MAP_KEY_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const MAX_BODY_BYTES = 1024 * 1024;

function yamlPath(mapKey) {
  return join(LEVELS_DIR, mapKey, 'map.level.yaml');
}

function listLevels() {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(yamlPath(entry.name)))
    .map((entry) => ({ mapKey: entry.name, yaml: readFileSync(yamlPath(entry.name), 'utf-8') }))
    .sort((a, b) => a.mapKey.localeCompare(b.mapKey));
}

function send(res, status, body, contentType = 'text/plain') {
  res.statusCode = status;
  res.setHeader('Content-Type', contentType);
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

async function handle(req, res) {
  // Mounted at /__level-editor, so req.url arrives with that prefix stripped.
  if (req.url === '/levels' && req.method === 'GET') {
    send(res, 200, JSON.stringify({ levels: listLevels() }), 'application/json');
    return;
  }

  const putMatch = req.url?.match(/^\/levels\/([^/]+)$/);
  if (putMatch) {
    if (req.method !== 'PUT') {
      send(res, 405, 'Method not allowed');
      return;
    }
    const mapKey = putMatch[1];
    if (!MAP_KEY_PATTERN.test(mapKey)) {
      send(res, 400, `Invalid map key "${mapKey}"`);
      return;
    }
    if (!existsSync(yamlPath(mapKey))) {
      send(res, 404, `Unknown level "${mapKey}" — the editor cannot create new levels`);
      return;
    }
    let body;
    try {
      body = await readBody(req);
    } catch (error) {
      send(res, 400, error instanceof Error ? error.message : 'Failed to read body');
      return;
    }
    if (body.trim() === '') {
      send(res, 400, 'Refusing to write an empty map.level.yaml');
      return;
    }
    writeFileSync(yamlPath(mapKey), body, 'utf-8');
    res.statusCode = 204;
    res.end();
    return;
  }

  send(res, 404, 'Not found');
}

/**
 * Dev-server-only file bridge for the level editor (/explorers-editor).
 * `apply: 'serve'` keeps this out of the build graph entirely, so node:fs
 * never reaches the Cloudflare Workers bundle.
 *
 * @returns {import('vite').Plugin}
 */
export function levelEditorDevPlugin() {
  return {
    name: 'level-editor-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__level-editor', (req, res) => {
        handle(req, res).catch((error) => {
          send(res, 500, error instanceof Error ? error.message : 'Internal error');
        });
      });
    },
  };
}
