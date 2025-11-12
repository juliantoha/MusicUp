import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concert Series - 9 Ready-to-Run Concert Formats",
  description: "Discover 9 concert series designed for real places: Empathy Concerts for senior homes with verified service hours, PianoTales for libraries, Markets & Parks, Hospitals, Schools, and more. Complete with repertoire, format guidelines, and booking resources.",
  keywords: [
    "empathy concerts",
    "senior home music",
    "library concerts",
    "piano tales",
    "farmers market concerts",
    "school assemblies",
    "hospital lobby music",
    "coffee shop concerts",
    "house concerts",
    "museum gallery performances",
    "playground concerts",
    "community music series",
    "verified service hours",
    "concert format templates"
  ],
  openGraph: {
    title: "Concert Series - Play the right set in the right room | MusicUp",
    description: "9 ready-to-run concert series for libraries, senior homes, markets, schools, and community spaces. Each with curated repertoire and clear format guidelines.",
    url: "https://www.musicup.co/series",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concert Series - Play the right set in the right room",
    description: "9 ready-to-run concert formats: Empathy Concerts, PianoTales, Markets & more. Sheet music and format guides included.",
  },
  alternates: {
    canonical: "https://www.musicup.co/series",
  },
};

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
