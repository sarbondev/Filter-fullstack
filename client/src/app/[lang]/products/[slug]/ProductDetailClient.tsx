'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetProductBySlugQuery } from '@/store/api/productApi';
import { useGetProductReviewsQuery } from '@/store/api/reviewApi';
import { t, formatPrice, getDiscountPercent, getImageUrl } from '@/shared/lib/utils';
import { Button, Badge, Skeleton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { addToCart, updateQuantity } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import { addToast } from '@/store/toastSlice';

interface Props { locale: Locale; dict: Dictionary; slug: string }

export function ProductDetailClient({ locale, dict, slug }: Props) {
  const { data: product, isLoading } = useGetProductBySlugQuery(slug);
  const { data: reviewData } = useGetProductReviewsQuery(product?.id ?? '', { skip: !product });
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const cartItem = useAppSelector((s) => s.cart.items.find((i) => i.product.id === product?.id));
  const isWished = product ? wishlistIds.includes(product.id) : false;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">{dict.products.noProducts}</p>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice ?? product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {dict.products.all}
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-200">
            {product.images[selectedImage] ? (
              <Image
                src={getImageUrl(product.images[selectedImage])}
                alt={t(product.name, locale)}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <ShoppingCart className="h-16 w-16" />
              </div>
            )}
            {discount > 0 && (
              <Badge variant="danger" className="absolute top-4 left-4 text-sm">-{discount}%</Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    i === selectedImage ? 'border-primary' : 'border-slate-200'
                  }`}
                >
                  <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              {typeof product.category === 'object' && product.category?.name ? t(product.category.name, locale) : ''}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{t(product.name, locale)}</h1>
          </div>

          {/* Rating */}
          {reviewData && reviewData.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i <= Math.round(reviewData.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">({reviewData.count} {dict.products.reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(effectivePrice)} UZS</span>
            {discount > 0 && (
              <span className="text-xl text-slate-400 line-through">{formatPrice(product.price)} UZS</span>
            )}
          </div>

          {/* Stock */}
          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `${dict.products.inStock} (${product.stock})` : dict.products.outOfStock}
          </Badge>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed">{t(product.description, locale)}</p>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {cartItem ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
                <button onClick={() => dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 }))} className="p-1 text-slate-500 hover:text-primary">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold text-slate-900">{cartItem.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 }))} className="p-1 text-slate-500 hover:text-primary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={() => {
                  dispatch(addToCart(product));
                  dispatch(addToast({ message: dict.common.addedToCart, type: 'success' }));
                }}
                icon={<ShoppingCart className="h-5 w-5" />}
              >
                {dict.products.addToCart}
              </Button>
            )}
            <Button
              variant={isWished ? 'primary' : 'outline'}
              size="lg"
              onClick={() => {
                dispatch(toggleWishlist(product.id));
                dispatch(addToast({ message: isWished ? dict.common.removedFromWishlist : dict.common.addedToWishlist, type: 'info' }));
              }}
              icon={<Heart className={`h-5 w-5 ${isWished ? 'fill-white' : ''}`} />}
            >
              {isWished ? dict.wishlist.removeFromWishlist : dict.wishlist.addToWishlist}
            </Button>
          </div>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{dict.products.specifications}</h3>
              <div className="space-y-3">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span className="text-slate-500">{t(spec.key, locale)}</span>
                    <span className="font-medium text-slate-900">{t(spec.value, locale)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
