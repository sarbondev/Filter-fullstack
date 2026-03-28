import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { Hero } from '@/widgets/hero/Hero';
import { TrustBadges } from '@/widgets/hero/TrustBadges';
import { FeaturedProducts } from '@/widgets/product-grid/FeaturedProducts';
import { WhyUs } from '@/widgets/hero/WhyUs';
import { CategoriesSection } from '@/widgets/hero/CategoriesSection';
import { Testimonials } from '@/widgets/hero/Testimonials';
import { BrandsSection } from '@/widgets/hero/BrandsSection';
import { CTASection } from '@/widgets/hero/CTASection';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <TrustBadges locale={locale} />
      <FeaturedProducts locale={locale} dict={dict} />
      <WhyUs locale={locale} />
      <CategoriesSection locale={locale} dict={dict} />
      <Testimonials locale={locale} />
      <BrandsSection locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
