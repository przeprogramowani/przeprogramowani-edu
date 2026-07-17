import { ChromaClient, CloudClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import { Chunk, ChunkMeta } from '../types.js';
import { sha1 } from './utilities.js';

interface ChromaClientConfig {
  path: string;
  tenant?: string;
  database?: string;
  auth?: {
    provider: string;
    credentials: string;
  };
}

export interface ChromaCredentials {
  apiKey?: string;
  tenant?: string;
  database?: string;
  url?: string;
}

// Cache for the client instance to avoid recreating it on every call
let cachedClient: ChromaClient | CloudClient | null = null;
let cachedConfig: string | null = null;

/**
 * Creates a ChromaDB client with support for local and cloud configurations.
 * The client is cached and reused for the same configuration.
 *
 * @param credentials - Optional credentials object. If not provided, falls back to process.env
 *
 * Cloud Client (when CHROMA_API_KEY is provided):
 * - apiKey: API key for Chroma Cloud authentication (required for cloud)
 * - tenant: Tenant ID for multi-tenant environments (optional, can be auto-resolved)
 * - database: Database name (optional, can be auto-resolved)
 *
 * Local/Remote Client (when apiKey is not provided):
 * - url: Full URL to remote ChromaDB instance (e.g., "http://localhost:8000")
 * - tenant: Tenant ID for multi-tenant environments
 * - database: Database name
 *
 * If no credentials are provided, connects to local instance.
 */
export function createChromaClient(credentials?: ChromaCredentials): ChromaClient | CloudClient {
  const chromaApiKey = credentials?.apiKey ?? process.env.CHROMA_API_KEY;
  const chromaTenant = credentials?.tenant ?? process.env.CHROMA_TENANT;
  const chromaDatabase = credentials?.database ?? process.env.CHROMA_DATABASE;
  const chromaUrl = credentials?.url ?? process.env.CHROMA_DB_URL;

  // Create a config signature for caching
  const configSignature = JSON.stringify({
    apiKey: chromaApiKey ? 'present' : 'none',
    tenant: chromaTenant || 'default',
    database: chromaDatabase || 'default',
    url: chromaUrl || 'local',
  });

  // Return cached client if config hasn't changed
  if (cachedClient && cachedConfig === configSignature) {
    return cachedClient;
  }

  // Use CloudClient if API key is provided
  if (chromaApiKey) {
    console.log('🌐 Connecting to Chroma Cloud');

    const cloudConfig: {
      apiKey: string;
      tenant?: string;
      database?: string;
    } = {
      apiKey: chromaApiKey,
    };

    // Add tenant if provided (can be auto-resolved if not)
    if (chromaTenant) {
      cloudConfig.tenant = chromaTenant;
      console.log(`   Tenant: ${chromaTenant}`);
    }

    // Add database if provided (can be auto-resolved if not)
    if (chromaDatabase) {
      cloudConfig.database = chromaDatabase;
      console.log(`   Database: ${chromaDatabase}`);
    }

    cachedClient = new CloudClient(cloudConfig);
    cachedConfig = configSignature;
    return cachedClient;
  }

  // Use regular ChromaClient for local or remote (non-cloud) instances
  if (chromaUrl) {
    console.log(`🔗 Connecting to remote ChromaDB at: ${chromaUrl}`);

    const config: ChromaClientConfig = { path: chromaUrl };

    // Add tenant if provided (default is handled by ChromaDB)
    if (chromaTenant) {
      config.tenant = chromaTenant;
      console.log(`   Tenant: ${chromaTenant}`);
    }

    // Add database if provided (default is handled by ChromaDB)
    if (chromaDatabase) {
      config.database = chromaDatabase;
      console.log(`   Database: ${chromaDatabase}`);
    }

    cachedClient = new ChromaClient(config);
    cachedConfig = configSignature;
    return cachedClient;
  }

  // Default: local connection
  console.log('🏠 Connecting to local ChromaDB instance');
  cachedClient = new ChromaClient();
  cachedConfig = configSignature;
  return cachedClient;
}

export async function makeCollection(client: ChromaClient | CloudClient, name: string) {
  const embeddingFunction = new OpenAIEmbeddingFunction({
    modelName: 'text-embedding-3-small',
  });

  return await client.getOrCreateCollection({
    name,
    metadata: { 'hnsw:space': 'cosine' },
    embeddingFunction,
  });
}

export async function upsertChunks(collection: Awaited<ReturnType<typeof makeCollection>>, chunks: Chunk[]) {
  // Validate metadata and de-duplicate by hash of text+meta essentials
  const ids: string[] = [];
  const docs: string[] = [];
  const metas: Record<string, string | number | boolean | null>[] = [];

  for (const c of chunks) {
    const parsed = ChunkMeta.safeParse(c.meta);
    if (!parsed.success) {
      console.warn('Invalid chunk meta, skipping:', parsed.error);
      continue;
    }
    const stableId = c.id + ':' + sha1(c.text);
    ids.push(stableId);
    docs.push(c.text);

    // Serialize arrays to JSON strings for ChromaDB compatibility
    // ChromaDB only accepts string, number, boolean, or null values
    const chromaMeta: Record<string, string | number | boolean | null> = {
      lessonId: c.meta.lessonId,
      sourceFile: c.meta.sourceFile,
      sectionSlug: c.meta.sectionSlug,
      sectionTitle: c.meta.sectionTitle,
      breadcrumbs: JSON.stringify(c.meta.breadcrumbs),
      order: c.meta.order,
      blockSpan: JSON.stringify(c.meta.blockSpan),
      charCount: c.meta.charCount,
      tokenEstimate: c.meta.tokenEstimate,
      parentId: c.meta.parentId ?? null,
      links: c.meta.links ? JSON.stringify(c.meta.links) : null,
      images: c.meta.images ? JSON.stringify(c.meta.images) : null,
      lang: c.meta.lang ?? null,
    };

    metas.push(chromaMeta);
  }

  if (!ids.length) return;

  // Process in smaller batches to avoid API timeouts and rate limits
  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(ids.length / BATCH_SIZE);

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batchIds = ids.slice(i, i + BATCH_SIZE);
    const batchDocs = docs.slice(i, i + BATCH_SIZE);
    const batchMetas = metas.slice(i, i + BATCH_SIZE);

    console.log(`      Upserting batch ${batchNum}/${totalBatches} (${batchIds.length} chunks)...`);

    try {
      await collection.upsert({
        ids: batchIds,
        documents: batchDocs,
        metadatas: batchMetas,
      });
    } catch (error) {
      console.error(`      ❌ Failed to upsert batch ${batchNum}:`, error);
      // Add a small delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`      Retrying batch ${batchNum}...`);
      await collection.upsert({
        ids: batchIds,
        documents: batchDocs,
        metadatas: batchMetas,
      });
    }

    // Add a small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
