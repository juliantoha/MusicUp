import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin",
  description: "Platform administration dashboard.",
  robots: { index: false, follow: false },
};

export default function SuperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
