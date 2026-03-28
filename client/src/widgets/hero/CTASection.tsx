'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Locale } from '@/shared/types';
import { Button } from '@/shared/ui';

const content = {
  en: {
    title: 'Ready to Upgrade Your Filtration?',
    desc: 'Get a free consultation from our engineers. We will recommend the perfect solution for your needs.',
    cta: 'Get Started',
    phone: 'Call Us',
  },
  ru: {
    title: 'Готовы обновить систему фильтрации?',
    desc: 'Получите бесплатную консультацию от наших инженеров. Мы порекомендуем идеальное решение.',
    cta: 'Начать',
    phone: 'Позвонить',
  },
  uz: {
    title: 'Filtrlash tizimingizni yangilashga tayyormisiz?',
    desc: "Muhandislarimizdan bepul maslahat oling. Ehtiyojlaringizga mos yechimni tavsiya qilamiz.",
    cta: 'Boshlash',
    phone: "Qo'ng'iroq qilish",
  },
};

export function CTASection({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-blue-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{c.title}</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">{c.desc}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="secondary" icon={<ArrowRight className="h-5 w-5" />}>
                {c.cta}
              </Button>
            </Link>
            <a href="tel:+998711234567">
              <Button size="lg" variant="ghost" className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white" icon={<Phone className="h-5 w-5" />}>
                {c.phone}
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
