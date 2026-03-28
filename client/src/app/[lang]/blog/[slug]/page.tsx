import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { BlogDetailClient } from './BlogDetailClient';

export default async function BlogDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <BlogDetailClient locale={locale} dict={dict} slug={slug} />;
}
