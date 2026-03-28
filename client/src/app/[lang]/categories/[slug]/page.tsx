import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { CategoryProductsClient } from './CategoryProductsClient';

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <CategoryProductsClient locale={locale} dict={dict} slug={slug} />;
}
