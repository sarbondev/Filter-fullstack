import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.products.title };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <ProductsPageClient locale={locale} dict={dict} />;
}
