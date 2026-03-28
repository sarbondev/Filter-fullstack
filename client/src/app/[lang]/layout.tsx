import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isValidLocale } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import StoreProvider from '@/providers/StoreProvider';
import { Navbar } from '@/widgets/navbar/Navbar';
import { Footer } from '@/widgets/footer/Footer';
import { ToastContainer } from '@/features/toast/Toast';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    en: 'FilterSystem - Premium Filter Solutions',
    ru: 'FilterSystem - Премиальные системы фильтрации',
    uz: 'FilterSystem - Premium filtr tizimlari',
  };
  return {
    title: { default: titles[lang] || titles.ru, template: '%s | FilterSystem' },
    description: 'Industrial and household filtration solutions',
  };
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ru' }, { lang: 'uz' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <StoreProvider>
          <Navbar locale={locale} dict={dict} />
          <main className="min-h-screen pt-16 lg:pt-[72px]">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
