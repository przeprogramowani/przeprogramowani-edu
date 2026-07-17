import 'dotenv/config';
import { ChromaClient } from 'chromadb';
import { createChromaClient, makeCollection } from './helpers/chroma.js';
import { getAllLessonMetadata, lessonToCollectionName } from './helpers/lessons.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface VisualizationData {
  embeddings: number[][];
  ids: string[];
  texts: string[];
  metadata: Record<string, string | number | boolean | null>[];
  collectionName?: string;
}

/**
 * List all available collections in ChromaDB
 */
async function listCollections(client: ChromaClient): Promise<string[]> {
  const collections = await client.listCollections();
  return collections
    .map((c) => c.name)
    .filter((name) => name.startsWith('course_'))
    .sort();
}

/**
 * Map collection name back to lesson ID using metadata
 */
async function collectionToLessonId(collectionName: string): Promise<string | null> {
  const allMetadata = await getAllLessonMetadata();

  for (const meta of allMetadata) {
    if (lessonToCollectionName(meta.lessonId) === collectionName) {
      return meta.lessonId;
    }
  }

  // If not found in metadata, return the collection name itself
  return collectionName;
}

/**
 * Fetch all embeddings from a ChromaDB collection
 */
async function fetchEmbeddings(client: ChromaClient, collectionName: string): Promise<VisualizationData> {
  const collection = await makeCollection(client, collectionName);

  // Get all items from the collection
  const results = await collection.get({
    include: ['embeddings', 'documents', 'metadatas'],
  });

  if (!results.embeddings || results.embeddings.length === 0) {
    throw new Error(`No embeddings found in collection: ${collectionName}`);
  }

  return {
    embeddings: results.embeddings,
    ids: results.ids,
    texts: (results.documents || []) as string[],
    metadata: (results.metadatas || []) as Record<string, string | number | boolean | null>[],
    collectionName,
  };
}

/**
 * Fetch embeddings from multiple collections and merge them
 */
async function fetchMultipleCollections(client: ChromaClient, collectionNames: string[]): Promise<VisualizationData> {
  console.log(`\n📊 Fetching from ${collectionNames.length} collections...`);

  const allData: VisualizationData[] = [];

  for (const collectionName of collectionNames) {
    try {
      const lessonId = await collectionToLessonId(collectionName);
      console.log(`   Fetching: ${collectionName} (${lessonId})`);
      const data = await fetchEmbeddings(client, collectionName);
      allData.push(data);
    } catch (error) {
      console.warn(`   ⚠️  Skipping ${collectionName}: ${error}`);
    }
  }

  if (allData.length === 0) {
    throw new Error('No embeddings found in any collection');
  }

  // Merge all data
  return {
    embeddings: allData.flatMap((d) => d.embeddings),
    ids: allData.flatMap((d) => d.ids),
    texts: allData.flatMap((d) => d.texts),
    metadata: allData.flatMap((d) => d.metadata),
  };
}

/**
 * Export data for visualization with Python (recommended approach)
 */
async function exportForPython(data: VisualizationData, outputPath: string) {
  const exportData = {
    embeddings: data.embeddings,
    ids: data.ids,
    texts: data.texts,
    metadata: data.metadata,
  };

  await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Exported ${data.embeddings.length} embeddings to ${outputPath}`);
  console.log('\nTo visualize with Python, run:');
  console.log('  python visualize_embeddings.py');
}

/**
 * Generate HTML visualization using Plot.ly
 */
async function generateHTMLVisualization(data: VisualizationData, reducedEmbeddings: number[][], outputPath: string) {
  // Group by lessonId for coloring
  const lessonColors: { [key: string]: string } = {};
  const uniqueLessons = [...new Set(data.metadata.map((m) => String(m.lessonId || 'unknown')))];

  const colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
  ];

  uniqueLessons.forEach((lesson, i) => {
    lessonColors[lesson] = colors[i % colors.length] || '#808080';
  });

  // Prepare plot data
  const traces = uniqueLessons.map((lessonId) => {
    const indices = data.metadata
      .map((m, i) => (String(m.lessonId || 'unknown') === lessonId ? i : -1))
      .filter((i) => i >= 0);

    return {
      x: indices.map((i) => reducedEmbeddings[i]?.[0] || 0),
      y: indices.map((i) => reducedEmbeddings[i]?.[1] || 0),
      text: indices.map((i) => {
        const meta = data.metadata[i];
        if (!meta) return 'Unknown';
        return `${meta.sectionTitle || 'Unknown'}<br>Lesson: ${meta.lessonId || 'Unknown'}<br>Chars: ${
          meta.charCount || 0
        }`;
      }),
      name: lessonId,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 8,
        color: lessonColors[lessonId] || '#808080',
        opacity: 0.7,
      },
    };
  });

  const firstEmbedding = data.embeddings[0];
  const embeddingDims = firstEmbedding ? firstEmbedding.length : 0;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ChromaDB Embeddings Visualization</title>
  <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    .info {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    #plot {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>ChromaDB Embeddings Visualization</h1>
  <div class="info">
    <strong>Total chunks:</strong> ${data.embeddings.length}<br>
    <strong>Embedding dimensions:</strong> ${embeddingDims}<br>
    <strong>Unique lessons:</strong> ${uniqueLessons.length}<br>
    <strong>Note:</strong> Embeddings reduced to 2D for visualization. Points close together are semantically similar.
  </div>
  <div id="plot"></div>
  <script>
    const data = ${JSON.stringify(traces)};
    const layout = {
      title: 'Embedding Space (2D Projection)',
      hovermode: 'closest',
      xaxis: { title: 'Dimension 1', zeroline: false },
      yaxis: { title: 'Dimension 2', zeroline: false },
      height: 700,
      showlegend: true,
    };
    Plotly.newPlot('plot', data, layout);
  </script>
</body>
</html>`;

  await fs.writeFile(outputPath, html);
  console.log(`✅ Generated HTML visualization: ${outputPath}`);
}

/**
 * Simple PCA implementation for dimensionality reduction
 */
function pcaReduce(embeddings: number[][], targetDims: number = 2): number[][] {
  if (embeddings.length === 0 || !embeddings[0]) {
    return [];
  }

  const n = embeddings.length;
  const dims = embeddings[0].length;

  // Center the data
  const mean = new Array(dims).fill(0);
  for (let i = 0; i < n; i++) {
    const row = embeddings[i];
    if (!row) continue;
    for (let j = 0; j < dims; j++) {
      mean[j] += row[j] || 0;
    }
  }
  for (let j = 0; j < dims; j++) {
    mean[j] /= n;
  }

  const centered = embeddings.map((row) => row.map((val, j) => val - mean[j]));

  // Compute covariance matrix (simplified: use first targetDims dimensions for speed)
  // For full PCA, you'd compute eigenvectors of covariance matrix
  // Here we'll use a simplified projection onto first 2 principal components

  // Simple projection: just take first targetDims dimensions (not true PCA, but fast)
  return centered.map((row) => row.slice(0, targetDims));
}

/**
 * Main visualization function
 */
async function main() {
  try {
    const client = createChromaClient();

    // List all available collections
    const availableCollections = await listCollections(client);

    if (availableCollections.length === 0) {
      console.log('❌ No collections found. Run ingestion first: npm run start');
      process.exit(1);
    }

    console.log(`\n📚 Found ${availableCollections.length} collection(s):`);

    // Map collections to lesson names
    const collectionInfo: Array<{ collection: string; lesson: string | null }> = [];
    for (const collection of availableCollections) {
      const lessonId = await collectionToLessonId(collection);
      collectionInfo.push({ collection, lesson: lessonId });
      console.log(`   ${collection} → ${lessonId}`);
    }

    // Parse command line arguments
    const arg = process.argv[2];
    let data: VisualizationData;
    let outputPrefix = 'embeddings';

    if (!arg) {
      // No argument: visualize ALL collections combined
      console.log(`\n🌐 Visualizing ALL collections combined...`);
      data = await fetchMultipleCollections(client, availableCollections);
      outputPrefix = 'all_lessons';
    } else if (arg === '--list') {
      // Just list collections and exit
      console.log('\n✅ Done. Use one of the collection names above, or omit argument to visualize all.');
      process.exit(0);
    } else if (arg.startsWith('course_')) {
      // Specific collection by name
      console.log(`\n📊 Fetching embeddings from collection: ${arg}`);
      const lessonId = await collectionToLessonId(arg);
      data = await fetchEmbeddings(client, arg);
      outputPrefix = `lesson_${(lessonId || arg).replace(/[^a-z0-9]/gi, '_')}`;
      console.log(`   Lesson: ${lessonId || 'unknown'}`);
    } else {
      // Try to find collection by lesson ID
      const targetCollection = lessonToCollectionName(arg);
      console.log(`\n📊 Fetching embeddings for lesson: ${arg}`);
      console.log(`   Collection: ${targetCollection}`);
      data = await fetchEmbeddings(client, targetCollection);
      outputPrefix = `lesson_${arg.replace(/[^a-z0-9]/gi, '_')}`;
    }

    console.log(`✅ Fetched ${data.embeddings.length} embeddings`);
    if (data.embeddings.length > 0 && data.embeddings[0]) {
      console.log(`   Dimensions: ${data.embeddings[0].length}`);
    }

    // Export for Python visualization (recommended)
    const jsonPath = path.join(process.cwd(), `${outputPrefix}_data.json`);
    await exportForPython(data, jsonPath);

    // Simple PCA reduction for HTML preview
    console.log('\n📉 Reducing dimensions with PCA...');
    const reduced = pcaReduce(data.embeddings, 2);

    // Generate HTML visualization
    const htmlPath = path.join(process.cwd(), `${outputPrefix}_viz.html`);
    await generateHTMLVisualization(data, reduced, htmlPath);

    console.log('\n✨ Visualization complete!');
    console.log(`   📁 ${jsonPath}`);
    console.log(`   🌐 ${htmlPath}`);
    console.log(`\nNext steps:`);
    console.log(`   python visualize_embeddings.py ${outputPrefix}  # Advanced visualization`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
