import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '和風認証 | Japanese Auth',
  description: 'Japanese-inspired authentication system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-slate-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
