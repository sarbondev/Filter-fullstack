import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { ProfilePageClient } from './ProfilePageClient';

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <ProfilePageClient locale={locale} dict={dict} />;
}
