import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performer Dashboard",
  description: "Manage your concert bookings, practice materials, and service hours.",
  robots: { index: false, follow: false },
};

export default function PerformerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
