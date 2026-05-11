import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Bulalım - Kayıp & Buluntu Platformu",
  description: "Kaybettiğin her şey, bir umutla geri dönebilir. Türkiye'nin topluluk tabanlı kayıp & buluntu platformu.",
  keywords: ["kayıp eşya", "buluntu", "lost and found", "Türkiye"],
  openGraph: {
    title: "Bulalım",
    description: "Kaybetmek son değil, başlangıçtır.",
    locale: "tr_TR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#000000]">
        {children}
      </body>
    </html>
  )
}
