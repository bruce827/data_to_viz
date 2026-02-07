import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}