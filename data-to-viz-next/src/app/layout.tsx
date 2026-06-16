import type { Metadata } from "next";
import "./globals.css";
import { GlobalSearchProvider } from '@/components/search/GlobalSearchProvider';
import { ThemeProvider } from '@/lib/ThemeContext';

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
        <ThemeProvider>
          <GlobalSearchProvider>{children}</GlobalSearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
