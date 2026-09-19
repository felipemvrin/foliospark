import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </motion.div>
  )
}
