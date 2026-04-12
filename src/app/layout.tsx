import "./globals.css";

import ClientShell from "@/components/layout/ClientShell";

export const metadata = {
  title: "CBS Opportunities",
  description: "Non-OCR opportunity aggregator for CBS students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background text-text antialiased">
      <body className="min-h-full">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
