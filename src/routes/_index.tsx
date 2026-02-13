import type { Route } from './+types/_index'

import { ToggleTheme } from '@/components/toggle-theme'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Perlica' },
    { name: 'description', content: 'React Router RSC demo' },
  ]
}

export default function IndexPage() {
  return (
    <main className='container py-4'>
      <ToggleTheme />
    </main>
  )
}
