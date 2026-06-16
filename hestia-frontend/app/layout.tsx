import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Hestia - Listas de Compras Inteligentes",
  description: "Transforme suas receitas em listas de compras organizadas com IA. Economize tempo e nunca mais esqueça um ingrediente.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: any
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground fabulous-bg selection:bg-primary/30">
        <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
