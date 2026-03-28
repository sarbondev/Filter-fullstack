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

interface Props { locale: Locale; dict: Dictionary }

export function CategoriesPageClient({ locale, dict }: Props) {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">{dict.categories.title}</h1>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)
          : categories?.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/${locale}/categories/${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-slate-100 transition-all duration-300 hover:shadow-xl h-56"
                >
                  <div className="relative z-10 p-5">
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 max-w-[70%] group-hover:text-primary transition-colors">
                      {t(cat.name, locale)}
                    </h3>
                  </div>

                  <div className="absolute bottom-0 right-0 w-36 h-36">
                    <div className="absolute inset-0 rounded-full bg-slate-200/60 scale-110 translate-x-4 translate-y-4" />
                    {cat.image ? (
                      <Image
                        src={getImageUrl(cat.image)}
                        alt={t(cat.name, locale)}
                        fill
                        className="object-contain p-2 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                        sizes="144px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FolderTree className="h-14 w-14 text-slate-300" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
