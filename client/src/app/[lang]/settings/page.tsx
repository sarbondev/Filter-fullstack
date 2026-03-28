import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { SettingsPageClient } from './SettingsPageClient';

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <SettingsPageClient locale={locale} dict={dict} />;
}
