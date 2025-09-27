import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"
import { AuthProvider } from "@/lib/auth-context"

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
    <html lang="pt-BR" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
