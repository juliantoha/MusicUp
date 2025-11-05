import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Library - Browse Repertoire & Sheet Music",
  description: "Browse our complete collection of curated concert repertoire. Filter by series, collection, and difficulty stage. Download PDFs and listen to audio references for every piece.",
  keywords: [
    "sheet music library",
    "concert repertoire",
    "music collection",
    "piano sheet music",
    "stage 1 beginner music",
    "stage 2 intermediate",
    "stage 3 advanced",
    "downloadable sheet music",
    "audio references",
    "practice resources",
    "performance music"
  ],
  openGraph: {
    title: "Music Library - Browse Curated Concert Repertoire | MusicUp",
    description: "Complete collection of concert pieces organized by series and difficulty. PDFs and audio included for every stage.",
    url: "https://music-up-alpha.vercel.app/library",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Music Library - Browse Repertoire",
    description: "Curated concert pieces with sheet music PDFs and audio references. Filter by difficulty stage.",
  },
  alternates: {
    canonical: "https://music-up-alpha.vercel.app/library",
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
