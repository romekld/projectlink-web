import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/layout/shared/providers";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project LINK",
  description: "Local Information Network for Kalusugan",
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // className={cn("font-sans", inter.variable, geistHeading.variable, geistMono.variable, geistSans.variable)}
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${geistHeading.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
