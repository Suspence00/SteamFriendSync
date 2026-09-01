import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SteamSync — Steam Shared Library & Overlap Finder',
  description: 'Compare Steam game libraries across 2 or more players. Calculate full intersections, partial overlaps, and missing games.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased">
        {children}
      </body>
    </html>
  );
}
