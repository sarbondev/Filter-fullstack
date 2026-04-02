import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { IndustriesPageClient } from './IndustriesPageClient';

const titles: Record<string, string> = {
  en: 'Industries We Serve',
  ru: 'Отрасли, которые мы обслуживаем',
  uz: 'Biz xizmat ko\'rsatadigan sohalar',
  kz: 'Біз қызмет көрсететін салалар',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: titles[lang] || titles.en };
}

export default async function IndustriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <IndustriesPageClient locale={lang as Locale} />;
}
