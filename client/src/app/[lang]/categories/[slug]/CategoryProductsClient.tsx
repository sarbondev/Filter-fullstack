'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetCategoryBySlugQuery } from '@/store/api/categoryApi';
import { useGetProductsQuery } from '@/store/api/productApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Skeleton, Button } from '@/shared/ui';
import { t } from '@/shared/lib/utils';
import { useQueryParams } from '@/shared/hooks';

interface Props { locale: Locale; dict: Dictionary; slug: string }

export function CategoryProductsClient({ locale, dict, slug }: Props) {
  const { data: category } = useGetCategoryBySlugQuery(slug);
  const { params, setParams } = useQueryParams();

  const page = Number(params.page) || 1;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';

  const { data, isLoading } = useGetProductsQuery({
    page, limit: 12,
    category: category?.id,
    sortBy, sortOrder,
  }, { skip: !category });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const sortOptions = [
    { value: 'createdAt-desc', label: dict.products.newest },
    { value: 'views-desc', label: dict.products.popular },
    { value: 'price-asc', label: dict.products.priceLowHigh },
    { value: 'price-desc', label: dict.products.priceHighLow },
  ];

  const handleSort = (value: string) => {
    const [by, order] = value.split('-');
    setParams({ sortBy: by, sortOrder: order, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setParams({ page: String(newPage) });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/${locale}/categories`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {dict.categories.all}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {category ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900">{t(category.name, locale)}</h1>
            <p className="mt-2 text-slate-500">{t(category.description, locale)}</p>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </>
        )}
      </motion.div>

      <div className="flex justify-end mb-6">
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => handleSort(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length === 0
          ? <p className="col-span-full text-center py-20 text-slate-500">{dict.products.noProducts}</p>
          : products.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
          ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-slate-500">{page} / {meta.totalPages}</span>
          <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => handlePageChange(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}
