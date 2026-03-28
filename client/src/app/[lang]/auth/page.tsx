import { Suspense } from 'react';
import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { AuthPageClient } from './AuthPageClient';

export default async function AuthPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <AuthPageClient locale={locale} dict={dict} />
    </Suspense>
  );
}
