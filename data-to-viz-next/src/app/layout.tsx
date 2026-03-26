import type { Metadata } from "next";
import "./globals.css";
import { GlobalSearchProvider } from '@/components/search/GlobalSearchProvider';

export const metadata: Metadata = {
  title: "Data to Viz - Interactive Decision Tree",
  description: "Find the best chart for your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalSearchProvider>{children}</GlobalSearchProvider>
      </body>
    </html>
  );
}
