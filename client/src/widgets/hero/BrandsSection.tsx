'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Locale } from '@/shared/types';
import { useGetPartnersQuery } from '@/store/api/partnerApi';
import { getImageUrl } from '@/shared/lib/utils';

const titles: Record<string, string> = {
  en: 'Our Partners',
  ru: 'Наши партнёры',
  uz: 'Bizning hamkorlar',
  kz: 'Біздің серіктестер',
};

const noData: Record<string, string> = {
  en: 'No partners available yet',
  ru: 'Партнёры пока не добавлены',
  uz: 'Hamkorlar hali qo\'shilmagan',
  kz: 'Серіктестер әзірше қосылмаған',
};

export function BrandsSection({ locale }: { locale: Locale }) {
  const { data: partners } = useGetPartnersQuery();
  const active = partners?.filter((p) => p.isActive) ?? [];

  return (
    <section className="py-14 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-10"
        >
          {titles[locale] ?? titles.en}
        </motion.p>

        {active.length === 0 ? (
          <p className="text-center text-slate-300 py-6">{noData[locale] ?? noData.en}</p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {active.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative h-12 w-28 sm:h-14 sm:w-36 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={getImageUrl(partner.image)}
                  alt="Partner"
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
