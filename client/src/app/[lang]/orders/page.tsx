import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { OrdersPageClient } from './OrdersPageClient';

export default async function OrdersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <OrdersPageClient locale={locale} dict={dict} />;
}
