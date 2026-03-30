'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FolderTree } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { t, getImageUrl } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function CategoriesSection({ locale, dict }: Props) {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <section className="py-20 bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {dict.categories.exploreCategories}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            : categories?.slice(0, 10).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-xl bg-white border border-slate-200/80 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/40 hover:border-slate-300 h-48"
                  >
                    <div className="relative z-10 p-4">
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 max-w-[70%] group-hover:text-primary transition-colors">
                        {t(cat.name, locale)}
                      </h3>
                    </div>

                    <div className="absolute bottom-0 right-0 w-28 h-28">
                      <div className="absolute inset-0 rounded-full bg-slate-100/80 scale-110 translate-x-4 translate-y-4" />
                      {cat.image ? (
                        <Image
                          src={getImageUrl(cat.image)}
                          alt={t(cat.name, locale)}
                          fill
                          className="object-contain p-2 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                          sizes="112px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FolderTree className="h-10 w-10 text-slate-200" />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
