import { build } from 'esbuild';

await build({
  entryPoints: ['dist/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'bundle/main.js',
  external: [
    '@nestjs/microservices',
    '@nestjs/websockets',
    'class-validator',
    'class-transformer',
    'class-transformer/storage',
  ],
  logLevel: 'info',
});
