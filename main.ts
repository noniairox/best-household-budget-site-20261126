// DompetKeluarga — program penyerahan (Node 22, pustaka standar saja).
// Situsnya adalah berkas statis di app/ (HTML, ES module, CSS, tanpa build step)
// yang dibuka peramban di app/index.html; tidak ada yang dimuat lewat jaringan.
// Program ini menyalin app/ dan screenshots/ dari samping berkas ini ke /output
// dan menulis /output/dossier.json — ringkasan yang dibaca juri (tangkapan layar,
// berkas dan byte pada pemuatan pertama, serta sumber) — dengan pustaka make.fun
// yang divendor. Biarkan vendor/makefun-frontend.ts apa adanya: penilai
// mengharuskan dossier.json sama persis byte demi byte dengan yang ditulis
// salinan pustaka miliknya sendiri.
//
// Menjalankan di luar kontainer penilai: MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Menjalankan situs secara lokal: node serve.ts lalu buka http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(join(here, 'app'))) {
  throw new Error('app/ tidak ditemukan di samping main.ts; tidak ada situs untuk diserahkan.');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas penilai (reference/gate.json): hanya text_max_bytes yang membentuk byte;
// yang lain menolak entri yang penilai pun menolak (lebih dari 4 tangkapan layar
// atau satu di atas 256 KiB; lebih dari 993 berkas dan direktori di app/ atau
// 16 MiB berkas app/: app/ dihitung berdampingan dengan batas 1000 entri /output
// sendiri, bersama screenshots/ dan dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
