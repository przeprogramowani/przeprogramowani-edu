class CompatFile extends Blob {
  readonly name: string;
  readonly lastModified: number;
  readonly webkitRelativePath = '';

  constructor(fileBits: BlobPart[] = [], fileName = '', options: FilePropertyBag = {}) {
    super(fileBits, options);
    this.name = String(fileName);
    this.lastModified = options.lastModified ?? Date.now();
  }
}

if (typeof globalThis.File === 'undefined') {
  Object.defineProperty(globalThis, 'File', {
    value: CompatFile,
    configurable: true,
    writable: true,
  });
}
