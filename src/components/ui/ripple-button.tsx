'use client'

import type { HTMLMotionProps } from 'motion/react'

import { AnimatePresence, motion, useAnimation } from 'motion/react'
import * as React from 'react'

import { Button as ButtonPrimitive } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Ripple = {
  id: number
  x: number
  y: number
}

type RippleButtonContextType = {
  ripples: Ripple[]
  setRipples: (ripples: Ripple[]) => void
}

const RippleButtonContext = React.createContext<RippleButtonContextType | null>(
  null,
)

const RippleButtonProvider = ({
  children,
  ...value
}: React.PropsWithChildren<RippleButtonContextType>) => (
  <AnimatePresence mode='wait'>
    <RippleButtonContext value={value}>{children}</RippleButtonContext>
  </AnimatePresence>
)

const useRippleButton = () => {
  const context = React.useContext(RippleButtonContext)
  if (!context)
    throw new Error(
      'useRippleButton must be used within a RippleButtonProvider',
    )

  return context
}

const rippleButtonVariants = {
  default: '[--ripple-button-ripple-color:var(--primary-foreground)]',
  outline: '[--ripple-button-ripple-color:var(--foreground)]',
  secondary: '[--ripple-button-ripple-color:var(--secondary-foreground)]',
  ghost: '[--ripple-button-ripple-color:var(--foreground)]',
  destructive: '[--ripple-button-ripple-color:var(--destructive-foreground)]',
  link: '[--ripple-button-ripple-color:var(--primary-foreground)]',
}

const MotionButton = motion.create(ButtonPrimitive)

function RippleButton({
  ref,
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof ButtonPrimitive> & HTMLMotionProps<'button'>) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)
  const controls = useAnimation()

  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    },
    [],
  )

  const handleClick = React.useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof ButtonPrimitive>['onClick']>
      >[0],
    ) => {
      createRipple(event)
      if (onClick) onClick(event)
    },
    [createRipple, onClick],
  )

  return (
    <RippleButtonProvider ripples={ripples} setRipples={setRipples}>
      <MotionButton
        data-slot='ripple-button'
        ref={buttonRef}
        animate={controls}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return

          e.preventDefault()
          const button = buttonRef.current
          if (!button) return

          const rect = button.getBoundingClientRect()
          const x = rect.width / 2
          const y = rect.height / 2

          setRipples((prev) => [...prev, { id: Date.now(), x, y }])
          controls.set({ scale: 0.96 })
        }}
        onKeyUp={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          controls.start({ scale: 1 })
          e.currentTarget.click()
        }}
        className={cn(
          'relative overflow-hidden',
          rippleButtonVariants[props.variant ?? 'default'],
          className,
        )}
        {...props}
      />
    </RippleButtonProvider>
  )
}

type RippleButtonRipplesProps = HTMLMotionProps<'span'> & {
  color?: string
  scale?: number
}

function RippleButtonRipples({
  color = 'var(--ripple-button-ripple-color)',
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  style,
  ...props
}: RippleButtonRipplesProps) {
  const { ripples } = useRippleButton()

  return ripples.map((ripple) => (
    <motion.span
      key={ripple.id}
      data-slot='ripple-button-ripple'
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale, opacity: 0 }}
      transition={transition}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
        width: '20px',
        height: '20px',
        backgroundColor: color,
        top: ripple.y - 10,
        left: ripple.x - 10,
        ...style,
      }}
      {...props}
    />
  ))
}

export { RippleButton, RippleButtonRipples }
