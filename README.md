# PM Consultores

Static, Spanish-first presentation site with complete English pages. No personal names, external fonts, trackers, runtime dependencies, database or application server. Inspired by the supplied portfolio’s editorial structure and EasyPressy’s indigo/navy visual language. PDF names, claims, contact details and client logos are not reused.

## Local use

Requires Node.js 22 or newer. In PowerShell:

```powershell
npm.cmd run dev
```

Open http://127.0.0.1:4173. The preview builds once on startup; restart after editing.

```powershell
npm.cmd run build
```

Deploy only `dist/`. Pages: `/`, `/en/`, `/contacto/`, `/en/contact/`.

## Where to edit

- `src/content.mjs`: all Spanish and English copy.
- `src/style.css`: visual design and responsive layouts.
- `src/site.config.mjs`: public contact endpoint, final site origin and indexing.
- `scripts/build.mjs`: shared page templates and static generation.
- `src/app.js`: keyboard-accessible concept tabs and contact form behavior.

## Contact is intentionally pending

The form validates fields and can copy an inquiry to the visitor’s clipboard. It does not store or transmit data until a real HTTPS endpoint is configured. It never claims that an inquiry was sent while disabled. No email address has been invented.

When ready, choose the recipient inbox and form provider or serverless handler. Set `contactEndpoint` to its HTTPS URL. The handler must accept JSON `{name, company, email, service, message, consent, language}` and return JSON `{ "ok": true }` only after accepting delivery. Cross-origin providers must allow this site's origin and JSON POST preflight. A generic form-provider URL is not necessarily compatible.

The handler must validate and bound inputs, require consent, reject header injection, apply spam protection and rate limiting, and keep email-provider credentials server-side. Update privacy copy with the actual recipient/controller, provider and retention period before enabling. Verify delivery and failure behavior end to end. Do not put API keys or private inbox credentials in source configuration.

## Hosting recommendation

Keep source in a private GitHub repository; use Cloudflare Pages for the static output. Build command: `npm run build`; output directory: `dist`; Node version: 24 (or another supported version >=22). No database or paid app server is required for this presentation.

GitHub Pages can serve the generated HTML, but review its restrictions on commercial hosting and your plan's repository visibility requirements before choosing it. The site itself has no checkout: e-commerce is an offered service. All asset links are relative, so normal pages also work under a repository prefix; the generic 404 home link assumes domain-root hosting.

Official references:
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/functions/
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Draft and launch

The default `indexable: false` emits noindex metadata and a disallowing robots.txt. This reduces search indexing; it does **not** restrict access. Keep previews local or use hosting access controls for confidential drafts. Set the final HTTPS `siteUrl` and `indexable: true` at launch to generate canonical URLs, language alternates and a sitemap. The visible development label is in each language's `draft` copy; remove its rendering at launch.

See `docs/launch-checklist.md` for the one-week work plan. The reference PDF stays outside the repository.
