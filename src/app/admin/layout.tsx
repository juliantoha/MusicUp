import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host Dashboard",
  description: "Manage your concert series, venues, and performer bookings.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
