import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LenisProvider } from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "DIGITALIZEU — AI-Powered Growth Systems for Modern Brands",
  description: "DIGITALIZEU helps brands dominate online through Meta Ads, high-converting funnels, automation systems, and data-driven growth strategies. Scale your business with AI-powered marketing.",
  keywords: "digital marketing, Meta Ads, Facebook ads, funnel building, marketing automation, lead generation, CRM, business growth",
  openGraph: {
    title: "DIGITALIZEU — Scale Your Business With AI-Powered Growth",
    description: "Premium digital growth company specializing in Meta Ads, sales funnels, and marketing automation.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body 
        className="min-h-screen theme-transition overflow-x-hidden font-sans" 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LenisProvider>
            <CustomCursor />
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
