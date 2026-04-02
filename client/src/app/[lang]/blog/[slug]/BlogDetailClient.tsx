'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetBlogBySlugQuery } from '@/store/api/blogApi';
import { t, getImageUrl } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui';

interface Props { locale: Locale; dict: Dictionary; slug: string }

export function BlogDetailClient({ locale, dict, slug }: Props) {
  const { data: blog, isLoading } = useGetBlogBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-slate-400">{dict.blog.empty}</p>
        <Link href={`/${locale}/blog`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {dict.blog.backToBlog}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.blog.backToBlog}
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {blog.views} {dict.blog.views}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {t(blog.title, locale)}
        </h1>

        {blog.image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-8">
            <Image
              src={getImageUrl(blog.image)}
              alt={t(blog.title, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          {t(blog.content, locale).split('\n').map((paragraph, i) => (
            paragraph.trim() ? <p key={i} className="text-slate-600 leading-relaxed mb-4">{paragraph}</p> : null
          ))}
        </div>
      </motion.article>
    </div>
  );
}
