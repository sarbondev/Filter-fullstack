'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetProductsQuery } from '@/store/api/productApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton } from '@/shared/ui';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function FeaturedProducts({ locale, dict }: Props) {
  const { data, isLoading } = useGetProductsQuery({ limit: 8, isFeatured: 'true' });
  const products = data?.data ?? [];

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
              {dict.products.featured}
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              {dict.hero.description}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            {dict.categories.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            {dict.categories.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
