#!/usr/bin/env node
// Pack a tutorial markdown file into a single self-contained doc.
// Local file links `[label](relative/path)` are resolved and the
// referenced files' contents are appended at the end of the doc.
//
// Usage:
//   node scripts/pack-tuto.mjs tuto/0_frontend.md [--out tuto/0_frontend.packed.md]
//
// Behavior:
//   - http(s)://, mailto:, anchors (#...), and absolute paths are left alone.
//   - Each unique referenced file appears once at the bottom under
//     "## Referenced files".
//   - Files that don't exist or aren't UTF-8 readable are reported and skipped.

import { readFile, writeFile, stat } from "node:fs/promises";
import { dirname, resolve, relative, extname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const EXT_TO_LANG = {
  ".ts": "ts",
  ".tsx": "tsx",
  ".js": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".gts": "gts",
  ".gjs": "gjs",
  ".hbs": "hbs",
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".css": "css",
  ".scss": "scss",
  ".html": "html",
  ".md": "md",
  ".sh": "bash",
  ".env": "ini",
};

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function parseArgs(argv) {
  const args = { input: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") {
      args.out = argv[++i];
    } else if (!args.input) {
      args.input = a;
    }
  }
  return args;
}

function isExternal(href) {
  return (
    /^(https?:|mailto:|tel:)/i.test(href) ||
    href.startsWith("#") ||
    isAbsolute(href)
  );
}

async function fileExists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

function langFor(filePath) {
  const ext = extname(filePath).toLowerCase();
  return EXT_TO_LANG[ext] ?? "";
}

function slugify(p) {
  return (
    "ref-" +
    p
      .replace(/^@/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
  );
}

async function collectLinks(markdown, baseDir) {
  const seen = new Map(); // absolutePath -> { label, relativeToRepo, slug }
  for (const m of markdown.matchAll(LINK_RE)) {
    const [, label, hrefRaw] = m;
    const href = hrefRaw.trim().split(/\s+/)[0];
    if (isExternal(href)) continue;

    const cleanHref = href.split("#")[0].split("?")[0];
    if (!cleanHref) continue;

    const abs = resolve(baseDir, cleanHref);
    if (!(await fileExists(abs))) continue;

    if (!seen.has(abs)) {
      const relativeToRepo = relative(repoRoot, abs);
      seen.set(abs, {
        label,
        relativeToRepo,
        slug: slugify(relativeToRepo),
      });
    }
  }
  return [...seen.entries()].map(([abs, meta]) => ({ abs, ...meta }));
}

function rewriteLinks(markdown, refs, baseDir) {
  const bySlug = new Map();
  for (const ref of refs) bySlug.set(ref.abs, ref.slug);

  return markdown.replace(LINK_RE, (full, label, hrefRaw) => {
    const href = hrefRaw.trim().split(/\s+/)[0];
    if (isExternal(href)) return full;
    const cleanHref = href.split("#")[0].split("?")[0];
    if (!cleanHref) return full;
    const abs = resolve(baseDir, cleanHref);
    const slug = bySlug.get(abs);
    if (!slug) return full;
    return `[${label}](#${slug})`;
  });
}

async function buildAppendix(refs) {
  if (refs.length === 0) return "";
  const lines = ["", "---", "", "## Referenced files", ""];
  for (const ref of refs) {
    const lang = langFor(ref.abs);
    let body;
    try {
      body = await readFile(ref.abs, "utf8");
    } catch (err) {
      body = `<!-- failed to read: ${err.message} -->`;
    }
    lines.push(`<a id="${ref.slug}"></a>`);
    lines.push(`### \`${ref.relativeToRepo}\``, "");
    lines.push("```" + lang);
    lines.push(body.replace(/\s+$/, ""));
    lines.push("```", "");
  }
  return lines.join("\n");
}

async function main() {
  const { input, out } = parseArgs(process.argv.slice(2));
  if (!input) {
    console.error(
      "Usage: node scripts/pack-tuto.mjs <input.md> [--out output.md]",
    );
    process.exit(1);
  }

  const inputAbs = resolve(process.cwd(), input);
  const baseDir = dirname(inputAbs);
  const source = await readFile(inputAbs, "utf8");

  const refs = await collectLinks(source, baseDir);
  const rewritten = rewriteLinks(source, refs, baseDir);
  const appendix = await buildAppendix(refs);

  const outAbs =
    out != null
      ? resolve(process.cwd(), out)
      : inputAbs.replace(/\.md$/i, ".packed.md");

  const banner = [
    `<!-- Packed from ${relative(repoRoot, inputAbs)} on ${new Date().toISOString()} -->`,
    `<!-- ${refs.length} referenced file(s) inlined below -->`,
    "",
    "> **READ-THIS-FILE-ONLY.** Every link to a project file in this document has been",
    "> rewritten to an in-document anchor (e.g. `#ref-libs-todos-front-src-index-ts`)",
    "> that resolves to a section under `## Referenced files` at the bottom.",
    "> Do **not** open, fetch, or read any external file path mentioned in this document —",
    "> the canonical content of every referenced file is already inlined here. If something",
    "> appears missing, scroll to `## Referenced files` and search by path.",
    "",
  ].join("\n");

  await writeFile(outAbs, banner + rewritten + appendix, "utf8");

  console.log(`Wrote ${relative(repoRoot, outAbs)}`);
  console.log(`Inlined ${refs.length} file(s):`);
  for (const ref of refs) console.log(`  - ${ref.relativeToRepo}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
