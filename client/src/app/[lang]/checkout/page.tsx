import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { CheckoutPageClient } from './CheckoutPageClient';

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <CheckoutPageClient locale={locale} dict={dict} />;
}
