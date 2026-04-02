'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FolderTree } from 'lucide-react';
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
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {dict.categories.exploreCategories}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{dict.categories.title}</p>
          </div>
          <Link
            href={`/${locale}/categories`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {dict.categories.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))
            : categories?.slice(0, 8).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-2xl h-52 bg-slate-100"
                  >
                    {cat.image ? (
                      <>
                        <Image
                          src={getImageUrl(cat.image)}
                          alt={t(cat.name, locale)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <FolderTree className="h-12 w-12 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-lg">
                        {t(cat.name, locale)}
                      </h3>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                        {dict.categories.viewAll}
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <Link
          href={`/${locale}/categories`}
          className="mt-8 sm:hidden flex items-center justify-center gap-1.5 text-sm font-semibold text-primary"
        >
          {dict.categories.viewAll}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
