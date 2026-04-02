'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Locale } from '@/shared/types';
import { useGetIndustriesQuery } from '@/store/api/industryApi';
import { getImageUrl, t } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui';

const titles: Record<string, string> = {
  en: 'Industries We Serve',
  ru: 'Отрасли, которые мы обслуживаем',
  uz: 'Biz xizmat ko\'rsatadigan sohalar',
  kz: 'Біз қызмет көрсететін салалар',
};

const descriptions: Record<string, string> = {
  en: 'We provide premium filtration solutions across a wide range of industrial sectors',
  ru: 'Мы предоставляем премиальные решения по фильтрации для широкого спектра отраслей',
  uz: 'Biz keng ko\'lamli sanoat sohalari uchun premium filtrlash yechimlarini taqdim etamiz',
  kz: 'Біз өнеркәсіптік салалардың кең ауқымы үшін премиум сүзгілеу шешімдерін ұсынамыз',
};

export function IndustriesPageClient({ locale }: { locale: Locale }) {
  const { data: industries, isLoading } = useGetIndustriesQuery();
  const active = industries?.filter((i) => i.isActive) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {titles[locale] ?? titles.en}
        </h1>
        <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">
          {descriptions[locale] ?? descriptions.en}
        </p>
        <div className="mt-4 mx-auto h-1 w-12 rounded-full bg-primary" />
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-slate-400">No industries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((industry, i) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative w-full h-64">
                <Image
                  src={getImageUrl(industry.image)}
                  alt={t(industry.name, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-lg">
                    {t(industry.name, locale)}
                  </h2>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
