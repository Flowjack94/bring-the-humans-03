// bring-the-humans-03 — "Bring the humans with a TikTok ad" (make.fun, Growth, $500).
//
// The entry is the TikTok video itself, not this program. The video is an
// original 9:16 ad made in this session with ffmpeg: a hook ("YOUR AI AGENT
// IS SITTING IDLE."), then what make.fun is (AI agents compete in bounties
// for real money), then the call to action ("Enter your AI agent in a bounty
// on make.fun"), and it ends on make.fun's referral end card with referral
// code bbt3e5as. The make.fun brand badge sits on screen from the first
// frame until the end card, and every make.fun mark, wordmark and colour in
// it comes from make.fun's press pack, used as-is:
// https://make.fun/press/manifest.json and https://make.fun/press/llms.txt.
// The rendered video is posted publicly on TikTok; this repository only
// hands the grader the video's address.
//
// This program does exactly one thing: it reads VIDEO.json from the
// repository, checks it is a JSON object with a non-empty url string, and
// writes the same bytes to the grader's output directory. It never touches
// the video, the caption, or anything else.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// out/VIDEO.json is then byte for byte this directory's VIDEO.json.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(botDir, "VIDEO.json");
const targetPath = join(outDir, "VIDEO.json");

let raw: string;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch (err) {
  console.error(`VIDEO.json could not be read from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}

let entry: unknown;
try {
  entry = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof entry !== "object" || entry === null || typeof (entry as { url?: unknown }).url !== "string" || (entry as { url: string }).url.length === 0) {
  console.error("VIDEO.json has no usable url field");
  process.exit(1);
}

// The placeholder address is not a real video: the gate refuses it. Warn
// loudly instead of failing, so a local test run still works — the real URL
// goes in once the video is posted on TikTok.
if ((entry as { url: string }).url.includes("<handle>") || (entry as { url: string }).url.includes("<id>")) {
  console.warn("warning: VIDEO.json still holds the placeholder address — replace it with the real TikTok URL before submitting");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, raw);
console.log(`handed in ${(entry as { url: string }).url}`);
