import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { AppStateProvider } from "@/contexts/app-state-context";
import { Toaster} from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
// import { SubscriptionProvider } from "@/hooks/use-subscription";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trackly",
  description: "Created by BasementSolutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          >
            <AppStateProvider>
              {/* <SubscriptionProvider> */}
                {children}
              {/* </SubscriptionProvider> */}
            </AppStateProvider>
          </ThemeProvider>

          <Toaster/>
        </body>
      </html>
    </AuthProvider>
  );
}
