import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'What kind of projects are best suited for FolioSpark?',
    answer:
      'It is designed for creatives, founders, and product teams who need a premium online presence that feels editorial, credible, and conversion-ready without requiring a custom CMS build.',
  },
  {
    question: 'How long does a portfolio build usually take?',
    answer:
      'Most engagements run from one to three weeks depending on content depth, revisions, and how much of the editorial direction is already defined.',
  },
  {
    question: 'Can I edit the content after launch?',
    answer:
      'Yes. The product is built around structured data, so the portfolio is easy to update without rewriting the entire page structure or design system.',
  },
  {
    question: 'Is the site secure and production-ready?',
    answer:
      'The frontend follows a validation-first approach with safe external links, controlled environment usage, and a privacy-focused analytics model. For production hardening, we also recommend deployment-level headers and backend auth for hosted publishing.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[var(--muted)]">FAQ</p>
          <h2 className="mt-5 font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
            Questions people ask before they move forward.
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index
            const idSuffix = item.question
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
            const panelId = `faq-panel-${idSuffix}-${index}`
            const buttonId = `faq-button-${idSuffix}-${index}`

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-alt)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  id={buttonId}
                >
                  <span className="text-base font-medium text-[var(--foreground)]">{item.question}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
                    <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-[var(--muted)] sm:px-6">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
