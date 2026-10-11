# Security boundaries

This site is a static, public presentation. It has no login, database, uploaded content, runtime packages or active contact backend. Visitors cannot execute code on the operator’s computer through a server component of this site because no such component is deployed. This does not protect the GitHub account or workstation from unrelated compromise.

## Browser protections

Every HTML page, including the 404 page, supplies a Content Security Policy through a meta tag. It blocks inline scripts and styles, dynamic evaluation, plugins, base URL changes and native form submissions. Fetch connections are blocked while contact is pending; a future configured HTTPS contact origin is the only permitted connect destination. CSS and JavaScript carry generated SHA-384 integrity checks. No trackers or external scripts are loaded. Referrer data is suppressed.

GitHub Pages enforces HTTPS and supplies HSTS. It does **not** apply `_headers`; that file is for a future compatible host. Meta CSP cannot enforce `frame-ancestors`, and Pages does not let this project set arbitrary response headers such as X-Frame-Options, Permissions-Policy or X-Content-Type-Options. The current site cannot promise complete framing protection. Move to a host/proxy with configurable headers if stronger framing or header controls are required. No sensitive authenticated interface exists here.

## Deployment protections

The build uses only Node built-ins and does not install npm packages. Workflow actions are pinned to full commit SHAs, with Dependabot proposing action updates weekly. Checkout credentials are not persisted. Default token access is read-only; only the deployment job has Pages-write and OIDC permissions. The deploy job accepts only `main`. Security checks validate generated policies, asset integrity and the artifact file allowlist before upload. Only `dist/` is deployed, never Git metadata, environment files or the reference PDF.

Verified repository settings: secret scanning and push protection enabled; Dependabot alerts and automated security fixes enabled; force pushes and deletion blocked on `main`, including for administrators; Pages environment restricted to `main`; workflow token default read-only with PR approval disabled; only GitHub-owned actions allowed and full SHA pins required. These settings reduce exposure but still permit the owner to push ordinary commits. Confirm settings through the GitHub API after administrative changes.

## Owner responsibilities

Use a passkey or two-factor authentication on GitHub, protect recovery codes, and keep your workstation and browser updated. Account MFA could not be verified through the available API response. Review unexpected collaborator invitations, OAuth authorizations and security alerts. Public repository source and Git commit metadata are visible; never commit private customer data or secrets. No browser policy can stop someone with authorized repository write access from replacing the site.

When enabling email, validate inputs and consent on the server, bound message sizes, prevent email header injection, add rate limits and bot protection, keep provider secrets server-side, restrict CORS, and test abuse and delivery failures. Frontend validation and CSP are not substitutes for server validation. Update privacy information at the same time.

## Checks and incident response

Run `npm.cmd run build` then `npm.cmd run check:security`. A successful build/check is not a penetration test. Recheck the live deployed pages and GitHub settings after deployment. If you suspect compromise, disable Pages, revoke suspicious tokens/sessions, secure the GitHub account, review repository/workflow changes, rotate any exposed credentials, and redeploy a reviewed commit. Do not post secret values in public issues.

References:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- https://docs.github.com/en/actions/reference/security/secure-use
