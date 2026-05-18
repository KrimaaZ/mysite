'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'zk' | 'sb'

const ThemeCtx = createContext<{
  theme: Theme
  toggle: () => void
  dark: boolean
  toggleDark: () => void
}>({ theme: 'zk', toggle: () => {}, dark: false, toggleDark: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('zk')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') as Theme | null
    if (savedTheme === 'zk' || savedTheme === 'sb') {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    const savedDark = localStorage.getItem('site-dark') === 'true'
    setDark(savedDark)
    document.documentElement.setAttribute('data-dark', String(savedDark))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('site-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-dark', String(dark))
    localStorage.setItem('site-dark', String(dark))
  }, [dark])

  const toggle = () => setTheme(t => (t === 'zk' ? 'sb' : 'zk'))
  const toggleDark = () => setDark(d => !d)

  return (
    <ThemeCtx.Provider value={{ theme, toggle, dark, toggleDark }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
