'use client';

import { motion } from 'framer-motion';
import type { Locale } from '@/shared/types';

const titles = {
  en: 'Trusted by Industry Leaders',
  ru: 'Нам доверяют лидеры отрасли',
  uz: 'Soha yetakchilari bizga ishonadi',
};

const brands = [
  'AQUA PURE', 'HYDRO TECH', 'CLEAN AIR', 'FILTER PRO', 'ECO FLOW', 'PURE LIFE',
];

export function BrandsSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-400 uppercase tracking-widest mb-10"
        >
          {titles[locale]}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {brands.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-2xl font-bold text-slate-200 tracking-wider hover:text-primary/40 transition-colors duration-300"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
