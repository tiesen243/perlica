'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export const ToggleTheme: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  )
}
