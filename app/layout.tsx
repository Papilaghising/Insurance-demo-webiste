import "@/app/globals.css"
import { Inter, Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata = {
  title: "TrueClaim | Transforming Insurance Claims with AI",
  description:
    "TrueClaim Intel leverages Generative AI to resolve claims in minutes, reduce fraud, and deliver real-time transparency.",
  generator: "v0.dev",
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`font-sans ${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
