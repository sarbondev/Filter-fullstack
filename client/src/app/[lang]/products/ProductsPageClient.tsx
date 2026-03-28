'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetProductsQuery } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Input, Button } from '@/shared/ui';
import { t } from '@/shared/lib/utils';

interface Props { locale: Locale; dict: Dictionary }

export function ProductsPageClient({ locale, dict }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading } = useGetProductsQuery({
    page, limit: 12,
    search: search || undefined,
    category: category || undefined,
    sortBy, sortOrder,
  });
  const { data: categories } = useGetCategoriesQuery();

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
    setSortBy(by);
    setSortOrder(order);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{dict.products.title}</h1>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={dict.nav.search}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)} icon={<SlidersHorizontal className="h-4 w-4" />}>
            {dict.products.filters}
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 flex flex-wrap gap-2"
        >
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !category ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {dict.products.all}
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setPage(1); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(cat.name, locale)}
            </button>
          ))}
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length === 0
          ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg text-slate-500">{dict.products.noProducts}</p>
            </div>
          )
          : products.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
          ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
          <span className="text-sm text-slate-500">{page} / {meta.totalPages}</span>
          <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>→</Button>
        </div>
      )}
    </div>
  );
}
