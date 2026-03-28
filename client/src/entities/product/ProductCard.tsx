"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import type { Product, Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import {
  t,
  formatPrice,
  getDiscountPercent,
  getImageUrl,
} from "@/shared/lib/utils";
import { Badge } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { addToCart } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { addToast } from "@/store/toastSlice";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  index?: number;
}

export function ProductCard({
  product,
  locale,
  dict,
  index = 0,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const cartItems = useAppSelector((s) => s.cart.items);
  const isWished = wishlistIds.includes(product.id);
  const isInCart = cartItems.some((i) => i.product.id === product.id);
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(addToast({ message: dict.common.addedToCart, type: "success" }));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    dispatch(
      addToast({
        message: isWished
          ? dict.common.removedFromWishlist
          : dict.common.addedToWishlist,
        type: "info",
      }),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group block h-full"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 flex flex-col h-full">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0">
            {product.images[0] ? (
              <Image
                src={getImageUrl(product.images[0])}
                alt={t(product.name, locale)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Eye className="h-12 w-12 text-slate-300" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
              {product.isFeatured && <Badge variant="primary">Featured</Badge>}
            </div>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${isWished ? "fill-red-500 text-red-500" : "text-slate-400"}`}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Category */}
            <p className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-1 truncate">
              {typeof product.category === "object" && product.category?.name
                ? t(product.category.name, locale)
                : ""}
            </p>

            {/* Title — 1 qator, kesiladi */}
            <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
              {t(product.name, locale)}
            </h3>

            {/* Description — 2 qator, kesiladi, balandligi fixed */}
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 h-8 leading-4">
              {t(product.shortDescription, locale)}
            </p>

            {/* Price — pastga surish uchun mt-auto */}
            <div className="mt-auto pt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(effectivePrice)}{" "}
                <span className="text-xs font-normal text-slate-500">UZS</span>
              </span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                isInCart
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : product.stock === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/25"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart
                ? dict.products.inCart
                : product.stock === 0
                  ? dict.products.outOfStock
                  : dict.products.addToCart}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
