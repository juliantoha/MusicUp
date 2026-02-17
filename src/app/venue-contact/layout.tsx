import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Contact Dashboard",
  description: "View concerts, performers, and manage your venue.",
  robots: { index: false, follow: false },
};

export default function VenueContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
