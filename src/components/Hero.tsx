import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'

import { portfolio } from '../data/portfolio'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-neutral-200 bg-[#f7f5f1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.03),_transparent_54%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-neutral-300" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-neutral-600"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Professional portfolio system
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-neutral-500">
              FolioSpark
            </p>
            <h1 className="max-w-4xl font-display text-[3.1rem] leading-[0.88] tracking-[-0.08em] text-neutral-900 sm:text-[4.7rem] lg:text-[7.2rem]">
              CREATE.
              <span className="block text-neutral-500">CURATE.</span>
              <span className="block">SHARE.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="max-w-xl text-lg leading-8 text-neutral-700"
          >
            Your professional story, in motion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
            >
              Explore work <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-900 transition hover:border-neutral-900"
            >
              Start a project
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
            className="flex flex-wrap items-center gap-3 pt-3 text-[0.68rem] uppercase tracking-[0.22em] text-neutral-500"
          >
            {portfolio.metrics.map((metric) => (
              <div key={metric.label} className="border-l border-neutral-300 px-3 first:border-l-0 first:pl-0">
                <span className="block text-lg font-medium tracking-[-0.06em] text-neutral-900">{metric.value}</span>
                <span>{metric.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
          className="relative"
        >
          <div className="relative rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_30px_80px_rgba(17,17,17,0.12)]">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 text-[0.64rem] uppercase tracking-[0.28em] text-neutral-500">
              <span>Portfolio</span>
              <span>01 / 06</span>
            </div>
            <img
              src={portfolio.profile.photo}
              alt={portfolio.profile.name}
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
              <div>
                <p className="text-[0.64rem] uppercase tracking-[0.28em] text-neutral-500">Current role</p>
                <p className="mt-2 text-xl font-medium text-neutral-900">{portfolio.profile.role}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-neutral-700">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
