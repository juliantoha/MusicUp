import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationStructuredData, ServiceStructuredData } from "@/components/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL('https://music-up-alpha.vercel.app'),
  title: {
    default: "MusicUp - Music Every Day | Concerts for Libraries, Senior Homes & Community Spaces",
    template: "%s | MusicUp"
  },
  description: "Ready-to-run concert series for real places. Connect performers with libraries, senior homes, markets, and community spaces. Verified service hours. Sheet music and audio included.",
  keywords: [
    "live music concerts",
    "community concerts",
    "music performance opportunities",
    "service hours",
    "senior home concerts",
    "library concerts",
    "student musicians",
    "concert booking",
    "music education",
    "performance venues",
    "empathy concerts",
    "piano tales",
    "farmers market music",
    "community music programs"
  ],
  authors: [{ name: "Oclef" }],
  creator: "Oclef",
  publisher: "MusicUp by Oclef",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://music-up-alpha.vercel.app",
    siteName: "MusicUp",
    title: "MusicUp - Music Every Day | Concert Series for Community Spaces",
    description: "Short, ready-to-run concerts that fit real places. Pick a series, pick a set, show up. MusicUp handles the rest.",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "MusicUp - Music Every Day",
        type: "image/png",
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "MusicUp - Music Every Day",
    description: "Connect performers with community spaces. Libraries, senior homes, markets, and more.",
    creator: "@musicup", // Update with actual Twitter handle
    images: ["/og-image.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Theme Color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563EB" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],

  // Verification (add these when you have them)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // App Links (for mobile apps if applicable)
  // appleWebApp: {
  //   capable: true,
  //   statusBarStyle: "default",
  //   title: "MusicUp",
  // },

  // Additional metadata
  category: "Music",
  classification: "Music Performance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationStructuredData />
        <ServiceStructuredData />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
