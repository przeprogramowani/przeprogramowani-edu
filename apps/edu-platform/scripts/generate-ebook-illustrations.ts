import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

type AssetType = 'infographic' | 'illustration';

type AssetSpec = {
  id: string;
  anchorHeading: string;
  anchorLine: number;
  assetType: AssetType;
  stylePreset: string;
  paletteHex: string[];
  promptPl: string;
  negativePromptPl: string;
  modelPrimary: string;
  modelFallback: string;
  mustHave: boolean;
  outputFilename: string;
  altTextPl: string;
  styleReferenceIds: string[];
};

type Spec = {
  ebook: string;
  assetBasePath: string;
  stylePreset: string;
  paletteHex: string[];
  sharedStylePrefixPl: string;
  sharedNegativePromptPl: string;
  assets: AssetSpec[];
};

type ManifestEntry = {
  assetId: string;
  attempt: number;
  model: string;
  promptHash: string;
  outputPath: string;
  outputFile: string;
  status: 'success' | 'error';
  error: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  createdAt: string;
  imageConfig: {
    aspect_ratio: string;
    image_size: string;
  };
};

type Manifest = {
  ebook: string;
  assetBasePath: string;
  updatedAt: string;
  entries: ManifestEntry[];
};

type ApprovalRecord = {
  approved: boolean;
  approvedAt: string;
  outputFile: string;
  outputPath: string;
  promptHash: string;
  note: string | null;
};

type Approvals = {
  ebook: string;
  updatedAt: string;
  assets: Record<string, ApprovalRecord>;
};

type CliOptions = {
  validateOnly: boolean;
  dryRun: boolean;
  assetId: string | null;
  attempts: number;
  force: boolean;
  specDir: string;
};

const ROOT_DIR = process.cwd();
const DEFAULT_SPEC_DIR = path.join(ROOT_DIR, 'scripts', 'ebook-illustrations');
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const TEXT_AND_IMAGE_MODELS = new Set([
  'google/gemini-3.1-flash-image-preview',
  'google/gemini-3-pro-image-preview',
  'google/gemini-2.5-flash-image',
  'openai/gpt-5-image',
  'openai/gpt-5-image-mini',
]);

async function loadEnvFiles(): Promise<void> {
  const envFiles = ['.env.local', '.env'];

  for (const envFile of envFiles) {
    const envPath = path.join(ROOT_DIR, envFile);

    try {
      const raw = await readFile(envPath, 'utf8');
      const lines = raw.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if (!key || process.env[key] !== undefined) {
          continue;
        }

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        process.env[key] = value;
      }
    } catch {
      continue;
    }
  }
}

function parseArgs(argv: string[]): CliOptions {
  let validateOnly = false;
  let dryRun = false;
  let assetId: string | null = null;
  let attempts = 2;
  let force = false;
  let specDir = DEFAULT_SPEC_DIR;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--validate-only') {
      validateOnly = true;
      continue;
    }

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--asset') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --asset');
      }
      assetId = value;
      index += 1;
      continue;
    }

    if (arg === '--attempts') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --attempts');
      }

      const parsed = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error('--attempts must be a positive integer');
      }

      attempts = Math.min(parsed, 2);
      index += 1;
      continue;
    }

    if (arg === '--force') {
      force = true;
      continue;
    }

    if (arg === '--spec') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --spec');
      }
      specDir = path.resolve(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    validateOnly,
    dryRun,
    assetId,
    attempts,
    force,
    specDir,
  };
}

function getSpecPath(specDir: string): string {
  return path.join(specDir, 'spec.json');
}

function getManifestPath(specDir: string): string {
  return path.join(specDir, 'generation-manifest.json');
}

function getApprovalsPath(specDir: string): string {
  return path.join(specDir, 'approvals.json');
}

async function loadSpec(specDir: string): Promise<Spec> {
  const raw = await readFile(getSpecPath(specDir), 'utf8');
  return JSON.parse(raw) as Spec;
}

function validateSpec(spec: Spec): void {
  if (!spec.ebook || !spec.assetBasePath || !Array.isArray(spec.assets) || spec.assets.length === 0) {
    throw new Error('Spec is missing required top-level fields');
  }

  if (!spec.assetBasePath.startsWith('/')) {
    throw new Error('assetBasePath must start with "/"');
  }

  const seenIds = new Set<string>();
  const seenFilenames = new Set<string>();

  for (const asset of spec.assets) {
    if (seenIds.has(asset.id)) {
      throw new Error(`Duplicate asset id: ${asset.id}`);
    }
    seenIds.add(asset.id);

    if (seenFilenames.has(asset.outputFilename)) {
      throw new Error(`Duplicate output filename: ${asset.outputFilename}`);
    }
    seenFilenames.add(asset.outputFilename);

    if (!asset.outputFilename.endsWith('.webp')) {
      throw new Error(`Asset ${asset.id} must output a .webp file`);
    }

    if (!Array.isArray(asset.paletteHex) || asset.paletteHex.length !== 3) {
      throw new Error(`Asset ${asset.id} must define the three-color palette`);
    }

    if (!asset.promptPl || !asset.negativePromptPl || !asset.modelPrimary || !asset.modelFallback) {
      throw new Error(`Asset ${asset.id} is missing prompt or model fields`);
    }
  }
}

function getSelectedAssets(spec: Spec, assetId: string | null): AssetSpec[] {
  if (!assetId) {
    return spec.assets;
  }

  const asset = spec.assets.find((candidate) => candidate.id === assetId);
  if (!asset) {
    throw new Error(`Unknown asset id: ${assetId}`);
  }

  return [asset];
}

function createPromptHash(spec: Spec, asset: AssetSpec): string {
  return createHash('sha256')
    .update(
      JSON.stringify({
        sharedStylePrefixPl: spec.sharedStylePrefixPl,
        sharedNegativePromptPl: spec.sharedNegativePromptPl,
        assetId: asset.id,
        modelPrimary: asset.modelPrimary,
        modelFallback: asset.modelFallback,
        promptPl: asset.promptPl,
        negativePromptPl: asset.negativePromptPl,
      }),
    )
    .digest('hex')
    .slice(0, 16);
}

function getOutputFilePath(spec: Spec, asset: AssetSpec): string {
  return path.join(ROOT_DIR, 'public', spec.assetBasePath.replace(/^\//, ''), asset.outputFilename);
}

function getWebOutputPath(spec: Spec, asset: AssetSpec): string {
  return `${spec.assetBasePath}/${asset.outputFilename}`;
}

function getImageConfig(spec: Spec, asset: AssetSpec): { aspect_ratio: string; image_size: string } {
  const defaultSize = (spec as Spec & { defaultImageSize?: string }).defaultImageSize ?? '1K';

  if (asset.id === 'hero-overview') {
    return {
      aspect_ratio: '16:9',
      image_size: '2K',
    };
  }

  return {
    aspect_ratio: '16:9',
    image_size: defaultSize,
  };
}

function getModalities(model: string): string[] {
  return TEXT_AND_IMAGE_MODELS.has(model) ? ['image', 'text'] : ['image'];
}

function buildUserPrompt(spec: Spec, asset: AssetSpec): string {
  return [
    'Wygeneruj pojedynczą ilustrację do ebooka.',
    '',
    `Typ assetu: ${asset.assetType}`,
    `Cel: ${asset.anchorHeading}`,
    '',
    asset.promptPl,
    '',
    'Ograniczenia negatywne:',
    spec.sharedNegativePromptPl,
    asset.negativePromptPl,
    '',
    'Jeśli dodajesz tekst do obrazu, użyj języka polskiego i ogranicz ilość tekstu do absolutnego minimum.',
  ].join('\n');
}

function findLatestSuccessfulEntry(
  manifest: Manifest,
  spec: Spec,
  asset: AssetSpec,
  options?: { requireCurrentPrompt?: boolean },
): ManifestEntry | null {
  const promptHash = createPromptHash(spec, asset);
  const matchingEntries = manifest.entries.filter(
    (entry) =>
      entry.assetId === asset.id &&
      entry.status === 'success' &&
      (!options?.requireCurrentPrompt || entry.promptHash === promptHash) &&
      entry.outputFile === getOutputFilePath(spec, asset),
  );

  if (matchingEntries.length === 0) {
    return null;
  }

  return matchingEntries[matchingEntries.length - 1] ?? null;
}

async function shouldSkipAsset(manifest: Manifest, spec: Spec, asset: AssetSpec): Promise<boolean> {
  const latestSuccess = findLatestSuccessfulEntry(manifest, spec, asset);
  if (!latestSuccess) {
    return false;
  }

  try {
    const outputStats = await stat(latestSuccess.outputFile);
    return outputStats.isFile() && outputStats.size > 0;
  } catch {
    return false;
  }
}

async function loadApprovals(specDir: string, spec: Spec): Promise<Approvals> {
  try {
    const raw = await readFile(getApprovalsPath(specDir), 'utf8');
    return JSON.parse(raw) as Approvals;
  } catch {
    return {
      ebook: spec.ebook,
      updatedAt: new Date().toISOString(),
      assets: {},
    };
  }
}

function getApprovalRecord(approvals: Approvals, asset: AssetSpec): ApprovalRecord | null {
  return approvals.assets[asset.id] ?? null;
}

function getAssetState(
  manifest: Manifest,
  approvals: Approvals,
  spec: Spec,
  asset: AssetSpec,
): 'approved' | 'generated-awaiting-review' | 'missing' {
  if (getApprovalRecord(approvals, asset)?.approved) {
    return 'approved';
  }

  if (findLatestSuccessfulEntry(manifest, spec, asset)) {
    return 'generated-awaiting-review';
  }

  return 'missing';
}

async function loadManifest(specDir: string, spec: Spec): Promise<Manifest> {
  try {
    const raw = await readFile(getManifestPath(specDir), 'utf8');
    return JSON.parse(raw) as Manifest;
  } catch {
    return {
      ebook: spec.ebook,
      assetBasePath: spec.assetBasePath,
      updatedAt: new Date().toISOString(),
      entries: [],
    };
  }
}

async function saveManifest(specDir: string, manifest: Manifest): Promise<void> {
  manifest.updatedAt = new Date().toISOString();
  await writeFile(getManifestPath(specDir), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function writeImageFromDataUrl(dataUrl: string, outputFile: string): Promise<{
  mimeType: string;
  fileSizeBytes: number;
}> {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Received image is not a base64 data URL');
  }

  const [, mimeType, encoded] = match;
  const inputExtension = mimeType.split('/')[1] ?? 'png';
  const tempInputPath = path.join(
    os.tmpdir(),
    `ebook-illustration-${Date.now()}-${Math.random().toString(16).slice(2)}.${inputExtension}`,
  );

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(tempInputPath, Buffer.from(encoded, 'base64'));

  try {
    if (mimeType === 'image/webp') {
      await writeFile(outputFile, Buffer.from(encoded, 'base64'));
    } else {
      await sharp(tempInputPath).webp({ quality: 90 }).toFile(outputFile);
    }
  } finally {
    await rm(tempInputPath, { force: true });
  }

  const outputStats = await stat(outputFile);
  return {
    mimeType,
    fileSizeBytes: outputStats.size,
  };
}

async function requestImageGeneration(
  apiKey: string,
  spec: Spec,
  asset: AssetSpec,
  model: string,
): Promise<{
  dataUrl: string;
  imageConfig: { aspect_ratio: string; image_size: string };
}> {
  const imageConfig = getImageConfig(spec, asset);
  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://przeprogramowani.pl',
      'X-Title': '10xDevs Ebook Illustrations',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(spec, asset),
        },
      ],
      modalities: getModalities(model),
      image_config: imageConfig,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{
      message?: {
        images?: Array<{
          image_url?: { url?: string };
          imageUrl?: { url?: string };
        }>;
      };
    }>;
  };

  const image =
    result.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
    result.choices?.[0]?.message?.images?.[0]?.imageUrl?.url;

  if (!image) {
    throw new Error('OpenRouter response did not include message.images[0].image_url.url');
  }

  return {
    dataUrl: image,
    imageConfig,
  };
}

function createManifestEntry(
  spec: Spec,
  asset: AssetSpec,
  attempt: number,
  model: string,
  imageConfig: { aspect_ratio: string; image_size: string },
  status: 'success' | 'error',
  error: string | null,
  mimeType: string | null,
  fileSizeBytes: number | null,
): ManifestEntry {
  return {
    assetId: asset.id,
    attempt,
    model,
    promptHash: createPromptHash(spec, asset),
    outputPath: getWebOutputPath(spec, asset),
    outputFile: getOutputFilePath(spec, asset),
    status,
    error,
    mimeType,
    fileSizeBytes,
    createdAt: new Date().toISOString(),
    imageConfig,
  };
}

async function main(): Promise<void> {
  await loadEnvFiles();

  const options = parseArgs(process.argv.slice(2));
  const spec = await loadSpec(options.specDir);
  validateSpec(spec);

  const assets = getSelectedAssets(spec, options.assetId);

  if (options.validateOnly) {
    console.log(
      JSON.stringify(
        {
          status: 'ok',
          ebook: spec.ebook,
          assetCount: spec.assets.length,
          selectedAssetCount: assets.length,
          mustHaveCount: spec.assets.filter((asset) => asset.mustHave).length,
          outputDirectory: path.join(ROOT_DIR, 'public', spec.assetBasePath.replace(/^\//, '')),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (options.dryRun) {
    const manifest = await loadManifest(options.specDir, spec);
    const approvals = await loadApprovals(options.specDir, spec);
    console.log(
      JSON.stringify(
        {
          status: 'dry-run',
          attempts: options.attempts,
          force: options.force,
          assets: assets.map((asset) => ({
            id: asset.id,
            modelPrimary: asset.modelPrimary,
            modelFallback: asset.modelFallback,
            outputFile: getOutputFilePath(spec, asset),
            outputPath: getWebOutputPath(spec, asset),
            modalities: getModalities(asset.modelPrimary),
            imageConfig: getImageConfig(spec, asset),
            approvalStatus: getAssetState(manifest, approvals, spec, asset),
            hasSuccessfulOutput: Boolean(findLatestSuccessfulEntry(manifest, spec, asset)),
            hasCurrentPromptOutput: Boolean(
              findLatestSuccessfulEntry(manifest, spec, asset, { requireCurrentPrompt: true }),
            ),
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for image generation');
  }

  const manifest = await loadManifest(options.specDir, spec);
  const approvals = await loadApprovals(options.specDir, spec);

  for (const asset of assets) {
    if (!options.force) {
      const assetState = getAssetState(manifest, approvals, spec, asset);

      if (assetState === 'approved') {
        console.log(`[generate] skip ${asset.id} (approved; use --force to regenerate)`);
        continue;
      }

      if (
        assetState === 'generated-awaiting-review' &&
        (await shouldSkipAsset(manifest, spec, asset))
      ) {
        console.log(
          `[generate] skip ${asset.id} (generated, waiting for review; use --force to regenerate)`,
        );
        continue;
      }
    }

    console.log(`[generate] ${asset.id}`);

    for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
      const model = attempt === 1 ? asset.modelPrimary : asset.modelFallback || asset.modelPrimary;
      const imageConfig = getImageConfig(spec, asset);

      try {
        console.log(`[generate] attempt ${attempt}/${options.attempts} via ${model}`);

        const generated = await requestImageGeneration(apiKey, spec, asset, model);
        const savedImage = await writeImageFromDataUrl(
          generated.dataUrl,
          getOutputFilePath(spec, asset),
        );

        manifest.entries.push(
          createManifestEntry(
            spec,
            asset,
            attempt,
            model,
            generated.imageConfig,
            'success',
            null,
            savedImage.mimeType,
            savedImage.fileSizeBytes,
          ),
        );
        await saveManifest(options.specDir, manifest);

        console.log(
          `[generate] ✓ saved ${getWebOutputPath(spec, asset)} (${savedImage.fileSizeBytes} bytes)`,
        );
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        manifest.entries.push(
          createManifestEntry(
            spec,
            asset,
            attempt,
            model,
            imageConfig,
            'error',
            message,
            null,
            null,
          ),
        );
        await saveManifest(options.specDir, manifest);
        console.error(`[generate] attempt ${attempt} failed for ${asset.id}: ${message}`);

        if (attempt === options.attempts) {
          throw error;
        }
      }
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
