import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-space-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}