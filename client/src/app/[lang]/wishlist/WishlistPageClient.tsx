'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { toggleWishlist } from '@/store/wishlistSlice';
import { useGetProductsQuery } from '@/store/api/productApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Button } from '@/shared/ui';
import { addToast } from '@/store/toastSlice';

interface Props { locale: Locale; dict: Dictionary }

export function WishlistPageClient({ locale, dict }: Props) {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const { data, isLoading } = useGetProductsQuery({ limit: 100 });

  const allProducts = data?.data ?? [];
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const handleClearAll = () => {
    for (const id of wishlistIds) {
      dispatch(toggleWishlist(id));
    }
    dispatch(addToast({ message: dict.wishlist.empty, type: 'info' }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.nav.products}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-50 p-3">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{dict.wishlist.title}</h1>
              <p className="text-sm text-slate-500">{wishlistIds.length} {dict.nav.products.toLowerCase()}</p>
            </div>
          </div>
          {wishlistIds.length > 0 && (
            <Button variant="outline" onClick={handleClearAll} icon={<Trash2 className="h-4 w-4" />}>
              {dict.wishlist.removeFromWishlist}
            </Button>
          )}
        </div>
      </motion.div>

      {wishlistIds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="rounded-3xl bg-slate-100 p-6 mb-6">
            <Heart className="h-12 w-12 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500">{dict.wishlist.empty}</p>
          <Link href={`/${locale}/products`}>
            <Button className="mt-6">{dict.nav.products}</Button>
          </Link>
        </motion.div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: wishlistIds.length }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
