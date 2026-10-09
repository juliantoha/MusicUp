// The public address of the app, used for canonical links, Open Graph,
// structured data, robots.txt and the sitemap.
//
// Set NEXT_PUBLIC_APP_URL in Vercel to move the app to a new domain
// (for example https://empathy.oclef.com). Email links already read the
// same variable, so one setting moves both.
const FALLBACK_URL = "https://www.musicup.co";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL).replace(/\/+$/, "");
