import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <ProductDetailClient locale={locale} dict={dict} slug={slug} />;
}
