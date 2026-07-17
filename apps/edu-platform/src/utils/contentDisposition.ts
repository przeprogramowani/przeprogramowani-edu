/**
 * Build a safe Content-Disposition header for file downloads.
 *
 * Uses ASCII `filename` fallback and UTF-8 `filename*` parameter
 * (RFC 5987) for full Unicode support.
 */
export function buildAttachmentContentDisposition(
  rawFilenameBase: string,
  extension = 'md'
): string {
  const filenameBase = sanitizeFilenameBase(rawFilenameBase);
  const safeExtension = sanitizeExtension(extension);
  const safeBase = toBrowserSafeAsciiFilename(filenameBase);
  const filenameWithExt = `${safeBase}.${safeExtension}`;
  const encodedUtf8 = encodeRFC5987ValueChars(filenameWithExt);

  return `attachment; filename="${filenameWithExt}"; filename*=UTF-8''${encodedUtf8}`;
}

function sanitizeFilenameBase(value: string): string {
  const fallback = 'download';
  const trimmed = (value || '').replace(/[\r\n]/g, '').trim();

  if (!trimmed) return fallback;

  // Remove trailing .md to avoid duplicate extension in response header.
  const withoutMdExt = trimmed.replace(/\.md$/i, '');
  if (!withoutMdExt) return fallback;

  return withoutMdExt;
}

function sanitizeExtension(value: string): string {
  const cleaned = (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

  return cleaned || 'md';
}

function toBrowserSafeAsciiFilename(value: string): string {
  const fallback = 'download';
  const polishSafe = transliteratePolishChars(value);
  const normalized = value
    .replace(/[\/\\?%*:|"<>]/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, '-')
    .trim()
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-._]+|[-._]+$/g, '');
  const fromPolishSafe = polishSafe
    .replace(/[\/\\?%*:|"<>]/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, '-')
    .trim()
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-._]+|[-._]+$/g, '');

  return fromPolishSafe || normalized || fallback;
}

function transliteratePolishChars(value: string): string {
  return value
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/Ą/g, 'A')
    .replace(/Ć/g, 'C')
    .replace(/Ę/g, 'E')
    .replace(/Ł/g, 'L')
    .replace(/Ń/g, 'N')
    .replace(/Ó/g, 'O')
    .replace(/Ś/g, 'S')
    .replace(/Ź/g, 'Z')
    .replace(/Ż/g, 'Z');
}

function encodeRFC5987ValueChars(value: string): string {
  return encodeURIComponent(value).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}
