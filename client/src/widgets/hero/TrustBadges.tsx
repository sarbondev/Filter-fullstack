'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import type { Locale } from '@/shared/types';

const badges = {
  en: [
    { icon: Shield, title: 'Quality Guarantee', desc: 'ISO 9001 certified production' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping across Uzbekistan' },
    { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy hassle-free returns' },
    { icon: Headphones, title: '24/7 Support', desc: 'Expert technical assistance' },
  ],
  ru: [
    { icon: Shield, title: 'Гарантия качества', desc: 'Сертификат ISO 9001' },
    { icon: Truck, title: 'Быстрая доставка', desc: 'Бесплатная доставка по Узбекистану' },
    { icon: RotateCcw, title: 'Возврат 30 дней', desc: 'Простой и удобный возврат' },
    { icon: Headphones, title: 'Поддержка 24/7', desc: 'Экспертная техническая помощь' },
  ],
  uz: [
    { icon: Shield, title: 'Sifat kafolati', desc: 'ISO 9001 sertifikatlangan' },
    { icon: Truck, title: 'Tez yetkazish', desc: "O'zbekiston bo'ylab bepul yetkazish" },
    { icon: RotateCcw, title: '30 kunlik qaytarish', desc: 'Oson va qulay qaytarish' },
    { icon: Headphones, title: "24/7 qo'llab-quvvatlash", desc: 'Mutaxassis texnik yordam' },
  ],
};

export function TrustBadges({ locale }: { locale: Locale }) {
  const items = badges[locale];

  return (
    <section className="py-14 bg-white border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 rounded-xl bg-slate-50 p-3.5">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
