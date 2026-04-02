'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/shared/types';
import { useGetIndustriesQuery } from '@/store/api/industryApi';
import { getImageUrl, t } from '@/shared/lib/utils';

const titles: Record<string, string> = {
  en: 'Industries We Serve',
  ru: 'Отрасли, которые мы обслуживаем',
  uz: 'Biz xizmat ko\'rsatadigan sohalar',
  kz: 'Біз қызмет көрсететін салалар',
};

const viewAll: Record<string, string> = {
  en: 'View All Industries',
  ru: 'Все отрасли',
  uz: 'Barcha sohalar',
  kz: 'Барлық салалар',
};

const noData: Record<string, string> = {
  en: 'No industries available yet',
  ru: 'Отрасли пока не добавлены',
  uz: 'Sohalar hali qo\'shilmagan',
  kz: 'Салалар әзірше қосылмаған',
};

export function IndustriesSection({ locale }: { locale: Locale }) {
  const { data: industries } = useGetIndustriesQuery();
  const active = industries?.filter((i) => i.isActive) ?? [];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {titles[locale] ?? titles.en}
          </h2>
          <div className="mt-3 mx-auto h-1 w-12 rounded-full bg-primary" />
        </motion.div>

        {active.length === 0 ? (
          <p className="text-center text-slate-400 py-10">{noData[locale] ?? noData.en}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.slice(0, 6).map((industry, i) => (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl h-56 sm:h-64"
                >
                  <Image
                    src={getImageUrl(industry.image)}
                    alt={t(industry.name, locale)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide drop-shadow-lg">
                      {t(industry.name, locale)}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {active.length > 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <Link
                  href={`/${locale}/industries`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {viewAll[locale] ?? viewAll.en}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
