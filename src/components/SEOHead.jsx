import Head from "next/head";

const SITE = "https://footy-builder.vercel.app";
const OG_IMAGE = `${SITE}/og-image.png`;

const TITLE =
  "Footy Builder — Free Online Lineup Builder | Soccer & Football Formation Generator";
const DESC =
  "Create professional soccer & football lineups for free. Drag-and-drop lineup builder with 4-3-3, 4-4-2, 3-5-2 & 100+ formations. Build, customize, download & share team sheets — no signup needed. The best free lineup maker online.";

const KEYWORDS = [
  // ...existing code for KEYWORDS array...
].join(", ");

export default function SEOHead({
  title = TITLE,
  description = DESC,
  path = "/",
}) {
  const url = `${SITE}${path}`;

  // ...existing code for appJsonLd, faqJsonLd, breadcrumbJsonLd...

  return (
    <Head>
      {/* ...existing code for all Head contents... */}
    </Head>
  );
}
