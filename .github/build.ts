await Deno.writeTextFile(
  'index.d.ts',
  `import type { Readable } from 'node:stream'\n\n` +
    (await Deno.readTextFile('index.d.ts')).replace(
      'type Stream = ReadableStream<Uint8Array>',
      'type Stream = ReadableStream<Uint8Array> | Readable',
    ),
)
