import fs from "node:fs";
import path from "node:path";
import { marked } from "file:///C:/Users/reaso/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js";

const sourcePath = "敏捷产品研发理念和方法.md";
const outputPath = "敏捷产品研发理念和方法.html";
const indexPath = "index.html";

const markdown = fs.readFileSync(sourcePath, "utf8");

function slugify(text) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const headingCounts = new Map();
const headings = [];

const renderer = new marked.Renderer();

renderer.heading = ({ tokens, depth }) => {
  const text = marked.parser(tokens);
  const plain = text.replace(/<[^>]*>/g, "");
  const base = slugify(plain) || `section-${headings.length + 1}`;
  const count = headingCounts.get(base) || 0;
  headingCounts.set(base, count + 1);
  const id = count ? `${base}-${count + 1}` : base;
  headings.push({ depth, text: plain, id });
  return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-label="跳转到本节">#</a>${text}</h${depth}>\n`;
};

renderer.image = ({ href, title, text }) => {
  const alt = escapeHtml(text || "");
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<figure class="illustration"><img src="${escapeHtml(href)}" alt="${alt}"${titleAttr} loading="lazy"><figcaption>${alt}</figcaption></figure>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

const body = marked.parse(markdown);
const title = headings.find((h) => h.depth === 1)?.text || "敏捷产品研发理念和方法";
const subtitle = markdown.match(/^>\s*(.+)$/m)?.[1] || "";

const toc = headings
  .filter((h) => h.depth === 2)
  .map((h) => `<a href="#${h.id}">${escapeHtml(h.text.replace(/^[一二三四五六七八九十]+、/, ""))}</a>`)
  .join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --paper: #fff8ec;
      --paper-2: #fffdf7;
      --ink: #22313f;
      --muted: #5b6b75;
      --teal: #2fb8ac;
      --coral: #f26d5b;
      --gold: #ffd166;
      --blue: #8ecae6;
      --green: #7ccf6b;
      --line: rgba(34, 49, 63, .18);
      --shadow: 0 20px 55px rgba(34, 49, 63, .12);
      --radius: 22px;
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      color: var(--ink);
      background:
        radial-gradient(circle at 12% 4%, rgba(255, 209, 102, .20), transparent 28rem),
        radial-gradient(circle at 90% 12%, rgba(47, 184, 172, .14), transparent 30rem),
        linear-gradient(180deg, #fff7e9 0%, var(--paper) 42%, #fffaf0 100%);
      font-family: "Microsoft YaHei", "Noto Sans CJK SC", "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
      line-height: 1.78;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(34, 49, 63, .035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 49, 63, .03) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,.65), transparent 65%);
    }

    a { color: inherit; }

    .page {
      width: min(1160px, calc(100% - 36px));
      margin: 0 auto;
      padding: 34px 0 80px;
    }

    .hero {
      position: relative;
      overflow: hidden;
      padding: 54px 56px 42px;
      border: 4px solid var(--ink);
      border-radius: 34px;
      background: var(--paper-2);
      box-shadow: var(--shadow);
    }

    .hero::after {
      content: "";
      position: absolute;
      right: -70px;
      bottom: -110px;
      width: 320px;
      height: 320px;
      border: 22px solid rgba(47, 184, 172, .22);
      border-radius: 50%;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding: 8px 14px;
      border: 3px solid var(--ink);
      border-radius: 999px;
      background: var(--gold);
      font-weight: 800;
      letter-spacing: 0;
    }

    .eyebrow::before {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--coral);
      border: 2px solid var(--ink);
    }

    h1 {
      margin: 0 0 18px;
      max-width: 900px;
      font-size: clamp(2.5rem, 6vw, 5rem);
      line-height: 1.08;
      letter-spacing: 0;
    }

    .hero blockquote {
      position: relative;
      z-index: 1;
      max-width: 860px;
      margin: 0;
      padding: 20px 24px;
      border-left: 8px solid var(--teal);
      border-radius: 0 var(--radius) var(--radius) 0;
      background: rgba(47, 184, 172, .10);
      font-size: 1.13rem;
      font-weight: 650;
    }

    .layout {
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 28px;
      align-items: start;
      margin-top: 28px;
    }

    .toc {
      position: sticky;
      top: 18px;
      padding: 18px;
      border: 3px solid var(--ink);
      border-radius: var(--radius);
      background: rgba(255, 253, 247, .94);
      box-shadow: 0 12px 28px rgba(34, 49, 63, .08);
    }

    .toc-title {
      margin: 0 0 12px;
      font-size: .96rem;
      font-weight: 900;
    }

    .toc nav {
      display: grid;
      gap: 8px;
    }

    .toc a {
      display: block;
      padding: 8px 10px;
      border-radius: 12px;
      color: var(--muted);
      text-decoration: none;
      font-size: .92rem;
      font-weight: 700;
    }

    .toc a:hover {
      color: var(--ink);
      background: rgba(255, 209, 102, .35);
    }

    main.article {
      min-width: 0;
      padding: 42px clamp(22px, 5vw, 64px);
      border: 4px solid var(--ink);
      border-radius: 34px;
      background: rgba(255, 253, 247, .96);
      box-shadow: var(--shadow);
    }

    .article > h1:first-child,
    .article > blockquote:first-of-type {
      display: none;
    }

    h2, h3 {
      position: relative;
      line-height: 1.28;
      letter-spacing: 0;
    }

    h2 {
      margin: 58px 0 20px;
      padding-top: 16px;
      font-size: clamp(1.6rem, 3.2vw, 2.35rem);
    }

    h2::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 86px;
      height: 8px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--coral), var(--gold), var(--teal));
    }

    h3 {
      margin: 34px 0 14px;
      font-size: 1.28rem;
    }

    .anchor {
      position: absolute;
      left: -1.2em;
      opacity: 0;
      color: var(--teal);
      text-decoration: none;
      transition: opacity .18s ease;
    }

    h2:hover .anchor,
    h3:hover .anchor { opacity: 1; }

    p { margin: 14px 0; }

    strong {
      color: var(--ink);
      font-weight: 900;
    }

    .signal {
      display: inline-block;
      margin: .12em 0;
      padding: .18em .7em .22em .82em;
      border-left: 6px solid var(--gold);
      border-radius: 0 14px 14px 0;
      background: rgba(255, 209, 102, .16);
      box-shadow: inset 0 0 0 1px rgba(255, 209, 102, .24);
    }

    blockquote .signal {
      border-left-color: var(--blue);
      background: rgba(142, 202, 230, .18);
      box-shadow: inset 0 0 0 1px rgba(142, 202, 230, .26);
    }

    blockquote {
      margin: 22px 0;
      padding: 18px 22px;
      border-left: 7px solid var(--coral);
      border-radius: 0 18px 18px 0;
      background: rgba(242, 109, 91, .09);
      font-weight: 700;
    }

    ul, ol {
      padding-left: 1.35em;
    }

    li { margin: 8px 0; }

    li::marker {
      color: var(--teal);
      font-weight: 900;
    }

    hr {
      margin: 46px 0;
      border: 0;
      height: 3px;
      border-radius: 999px;
      background: repeating-linear-gradient(90deg, rgba(34,49,63,.25) 0 18px, transparent 18px 30px);
    }

    .illustration {
      margin: 30px 0 34px;
      padding: 12px;
      border: 4px solid var(--ink);
      border-radius: 28px;
      background: #fffaf0;
      box-shadow: 0 18px 36px rgba(34, 49, 63, .10);
    }

    .illustration img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 18px;
    }

    .illustration figcaption {
      margin-top: 10px;
      color: var(--muted);
      text-align: center;
      font-size: .92rem;
      font-weight: 800;
    }

    code {
      padding: .15em .35em;
      border: 1px solid rgba(34, 49, 63, .15);
      border-radius: 8px;
      background: rgba(142, 202, 230, .20);
      font-family: "Cascadia Code", Consolas, monospace;
      font-size: .94em;
    }

    .footer-note {
      margin-top: 42px;
      padding: 18px 22px;
      border-radius: 20px;
      background: rgba(47, 184, 172, .12);
      color: var(--muted);
      font-weight: 700;
      text-align: center;
    }

    @media (max-width: 900px) {
      .page { width: min(100% - 24px, 760px); padding-top: 18px; }
      .hero { padding: 34px 24px 30px; border-radius: 26px; }
      .layout { display: block; }
      .toc { position: static; margin-bottom: 22px; }
      .toc nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      main.article { padding: 28px 18px; border-radius: 26px; }
      .anchor { display: none; }
    }

    @media (max-width: 560px) {
      h1 { font-size: 2.35rem; }
      .toc nav { grid-template-columns: 1fr; }
      .hero blockquote { font-size: 1rem; }
      .article { font-size: .98rem; }
    }

    @media print {
      body { background: white; }
      body::before, .toc, .anchor { display: none; }
      .page { width: 100%; padding: 0; }
      .hero, main.article, .illustration { box-shadow: none; }
      .layout { display: block; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <div class="eyebrow">Agile Product Development</div>
      <h1>${escapeHtml(title)}</h1>
      <blockquote>${escapeHtml(subtitle)}</blockquote>
    </header>
    <div class="layout">
      <aside class="toc" aria-label="文章目录">
        <p class="toc-title">目录</p>
        <nav>
          ${toc}
        </nav>
      </aside>
      <main class="article">
${body}
        <div class="footer-note">围绕用户价值，小步验证，持续改进。</div>
      </main>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(outputPath, html, "utf8");
fs.writeFileSync(indexPath, html, "utf8");
console.log(path.resolve(outputPath));
