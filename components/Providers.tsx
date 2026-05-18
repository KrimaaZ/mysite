'use client'

import { LangProvider } from '@/lib/lang'
import { ThemeProvider } from '@/lib/theme'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  )
}
