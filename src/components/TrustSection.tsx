import { motion } from 'framer-motion'

const trustPoints = [
  { value: '14', label: 'brand launches' },
  { value: '1–3w', label: 'typical delivery window' },
  { value: '4.9/5', label: 'client satisfaction' },
]

const clientNames = ['Northstar', 'Mori Atelier', 'Kite & Co.', 'Aster Labs', 'Northline']

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
              Used by teams that need clarity, polish, and momentum.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">
              FolioSpark was designed for people who want their work to feel premium without a slow, fragile production process. The result is a better story, less friction, and a site that helps clients take action.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustPoints.map((point, index) => (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background-alt)] p-5"
              >
                <div className="text-3xl font-medium text-[var(--foreground)]">{point.value}</div>
                <div className="mt-2 text-sm text-[var(--muted)]">{point.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-8">
          <ul aria-label="Trusted by" className="flex flex-wrap gap-3">
            {clientNames.map((name) => (
              <li
                key={name}
                className="rounded-full border border-[var(--border)] bg-[var(--background-alt)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
