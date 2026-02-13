'use client'

import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState)

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) ?? defaultTheme
  })

  const setTheme = React.useCallback(
    (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      _setTheme(theme)

      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    },
    [storageKey],
  )

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}

      <script>{`(function() {
        var theme = localStorage.getItem('${storageKey}') || '${defaultTheme}'
        var restoreAnimation = (function() {
          var css = document.createElement('style')
          css.append(document.createTextNode('*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'))
          document.head.append(css)
          return () => {
            ;(() => window.getComputedStyle(document.body))()
            setTimeout(() => css.remove(), 1)
          }
        })()

        var root = document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
          var systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light'
          root.classList.add(systemTheme)
        } else root.classList.add(theme)

        restoreAnimation()
      })();`}</script>
    </ThemeProviderContext>
  )
}
