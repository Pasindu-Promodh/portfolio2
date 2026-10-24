import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://pasindu-promodh.github.io/portfolio2/";

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function withMeta(html, { path, title, description, image, card }) {
  const url = SITE_URL + path;
  const setMeta = (attr, name, value) => {
    html = html.replace(
      new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`),
      (_, open, close) => open + escapeHtml(value) + close
    );
  };

  html = html.replace(
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeHtml(title)}</title>`
  );
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    (_, open, close) => open + url + close
  );
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  if (image) {
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", title);
    setMeta("name", "twitter:image", image);
  }
  if (card) setMeta("name", "twitter:card", card);
  return html;
}

// GitHub Pages has no SPA fallback, so emit a real HTML file per route
// (with its own title/description/preview image for crawlers and link
// previews), a 404.html fallback, a sitemap and robots.txt.
function staticPages() {
  let outDir;
  return {
    name: "static-pages",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const projects = JSON.parse(
        readFileSync(resolve(import.meta.dirname, "src/data/projects.json"), "utf8")
      );
      const html = readFileSync(resolve(outDir, "index.html"), "utf8");
      const paths = [""];

      const writePage = (path, meta) => {
        const dir = resolve(outDir, path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), withMeta(html, { path, ...meta }));
        paths.push(path);
      };

      writePage("projects/", {
        title: "Projects | Pasindu Promod",
        description:
          "Games, mobile apps, web apps and tools built by Pasindu Promod.",
      });
      for (const p of projects) {
        writePage(`project/${p.id}/`, {
          title: `${p.name} | Pasindu Promod`,
          description: p.description,
          image: /^https?:\/\//.test(p.image) ? p.image : SITE_URL + p.image,
          card: "summary_large_image",
        });
      }

      writeFileSync(resolve(outDir, "404.html"), html);
      writeFileSync(
        resolve(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
          .join("\n")}\n</urlset>\n`
      );
      writeFileSync(
        resolve(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticPages()],
  base: "/portfolio2/",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
