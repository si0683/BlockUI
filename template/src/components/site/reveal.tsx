import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

interface Props {
  children: ReactNode
  /** Seconds before the animation starts: use index * 0.08 for a cascade */
  delay?: number
  /** Lift the block a little on hover */
  lift?: boolean
  className?: string
}

// Fades the block in and slides it up when it scrolls into view (Motion, https://motion.dev).
// In .astro use it with client:visible; the children stay plain HTML.
export function Reveal({
  children,
  delay = 0,
  lift = false,
  className,
}: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={lift && !reduce ? { y: -6 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
