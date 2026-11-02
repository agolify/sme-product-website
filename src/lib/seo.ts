const SITE_URL = "https://www.dawacoffeemachienesandaccessories.com";

export function setPageMetadata({
  title,
  description,
  path,
  image,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: string;
}) {
  document.title = title;

  const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const canonicalUrl = `${SITE_URL}${path}`;
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[name="robots"]', "name", "robots", robots ?? "index, follow");
  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta('meta[property="og:description"]', "property", "og:description", description);
  setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  if (image) setMeta('meta[property="og:image"]', "property", "og:image", image);
}

export const siteUrl = SITE_URL;
