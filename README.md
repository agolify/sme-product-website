# Dawa coffee machines

## SEO page generation

`npm run build` fetches the public product catalog from `VITE_API_URL` (or the production API by default) and generates crawlable HTML for the homepage, catalog, categories, and product detail URLs, along with the sitemap. The API must be reachable during production builds; a failed catalog request stops the build so a deployment cannot publish a stale sitemap.

To keep generated pages current after admin product changes, create a production Deploy Hook in the Vercel project and set its URL as the backend secret `VERCEL_SEO_DEPLOY_HOOK_URL`. Product create, update, and delete operations then trigger a rebuild. Without that optional secret, changes appear in the client-rendered catalog but generated search pages and the sitemap update on the next deployment.
