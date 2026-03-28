'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Droplets, Wind, Gauge } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { Button } from '@/shared/ui';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export function Hero({ locale, dict }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white" />
      <div className="absolute top-10 right-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-[100px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                FilterSystem Factory
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.1] tracking-tight">
                {dict.hero.title}
                <span className="block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mt-2">
                  {dict.hero.subtitle}
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
                {dict.hero.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href={`/${locale}/products`}>
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  {dict.hero.shopNow}
                </Button>
              </Link>
              <Link href={`/${locale}/categories`}>
                <Button variant="outline" size="lg" icon={<Play className="h-4 w-4" />}>
                  {dict.hero.viewCatalog}
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-14 flex gap-10 sm:gap-14"
            >
              {[
                { value: '500+', label: 'Products' },
                { value: '50K+', label: 'Customers' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual — Image + Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-slate-200/60">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
                alt="Industrial filter system"
                width={600}
                height={500}
                className="w-full h-[500px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

              {/* Overlay text */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl bg-white/90 backdrop-blur-md p-5 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['A', 'B', 'C'].map((letter) => (
                        <div key={letter} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white border-2 border-white">
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">50,000+ customers</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1,2,3,4,5].map((i) => (
                          <svg key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                        <span className="text-xs text-slate-500 ml-1">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 rounded-2xl bg-white shadow-xl border border-slate-100 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Water Filters</p>
                  <p className="text-sm font-bold text-slate-900">200+ models</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-2 -left-6 rounded-2xl bg-white shadow-xl border border-slate-100 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5">
                  <Wind className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Air Filters</p>
                  <p className="text-sm font-bold text-slate-900">150+ models</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-8 rounded-2xl bg-white shadow-xl border border-slate-100 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2.5">
                  <Gauge className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Efficiency</p>
                  <p className="text-sm font-bold text-slate-900">99.9%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
