import { motion } from 'framer-motion'

import { usePortfolioStore } from '../store/portfolioStore'
import { SectionHeading } from './SectionHeading'
import { getTranslations } from '../lib/i18n'

export function ServicesSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const copy = getTranslations(usePortfolioStore((state) => state.data.siteSettings?.locale))

  return (
    <section id="services" className="bg-[var(--background-alt)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.home.servicesEyebrow}
          title={copy.home.servicesTitle}
          description={copy.home.servicesDescription}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {portfolio.services.map((service, index) => (
            <motion.div
              key={`${service.name}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`rounded-[1.8rem] border p-6 ${service.featured ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--border)] bg-[var(--surface)]'} `}
              style={{ boxShadow: service.featured ? 'var(--shadow-soft)' : 'none' }}
            >
              {service.featured ? (
                <div className="mb-5 inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)]">
                  {copy.home.mostRequested}
                </div>
              ) : null}

              <div className="flex items-end justify-between gap-4">
                <h3 className="text-2xl font-medium text-[var(--foreground)]">{service.name}</h3>
                <span className="text-xl font-medium text-[var(--foreground)]">{service.price}</span>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{service.description}</p>

              <ul className="mt-6 space-y-3 border-t border-[var(--border)] pt-5">
                {service.features.map((feature, featureIndex) => (
                  <li key={`${feature}-${featureIndex}`} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
