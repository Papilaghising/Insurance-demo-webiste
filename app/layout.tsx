import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"
import type { ReactNode } from "react"
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: "TrueClaim | Transforming Insurance Claioms with AI",
  description:
    "TrueClaim Intel leverages Generative AI to resolve claims in minutes, reduce fraud, and deliver real-time transparency.",
  generator: "v0.dev",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-background" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
