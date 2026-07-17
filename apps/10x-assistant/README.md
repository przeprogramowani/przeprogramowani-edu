# 10x Assistant

An AI-powered assistant with RAG (Retrieval-Augmented Generation) capabilities for querying the 10xDevs course content.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# OpenAI API Key (required for embeddings and LLM)
OPENAI_API_KEY=your_openai_api_key_here

# Chroma Configuration
# Option 1: Chroma Cloud (recommended for production)
CHROMA_API_KEY=your_chroma_cloud_api_key
# CHROMA_TENANT=your_tenant_id (optional)
# CHROMA_DATABASE=your_database_name (optional)

# Option 2: Remote ChromaDB instance
# CHROMA_DB_URL=http://localhost:8000
# CHROMA_TENANT=default_tenant
# CHROMA_DATABASE=default_database

# Option 3: Local ChromaDB (default if no variables set)
# No configuration needed - connects to local instance automatically
```

### RAG Integration

The assistant integrates with the `10x-rag` project for retrieval-augmented generation:

- **Query Service**: Uses `executeQuery` from `10x-rag/src/lib/query-service.ts`
- **Vector Store**: ChromaDB client from `10x-rag/src/helpers/chroma.ts`
- **API Endpoint**: `/api/rag` processes queries and returns AI-generated answers with sources

The RAG pipeline:
1. Performs semantic search on lesson summaries to find relevant lessons
2. Retrieves relevant chunks from selected lessons
3. Generates contextual answers using GPT-4o-mini
4. Returns answers with source attribution

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
