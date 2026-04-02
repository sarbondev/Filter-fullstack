'use client';

import { motion } from 'framer-motion';
import { Award, Droplets, Wind, Factory, Gauge, Leaf } from 'lucide-react';
import type { Locale } from '@/shared/types';

const content = {
  en: {
    title: 'Why Choose FilterSystem?',
    subtitle: 'We combine decades of filtration expertise with modern manufacturing technology',
    features: [
      { icon: Droplets, title: 'Water Filters', desc: 'Reverse osmosis, UV, carbon, and sediment filters for clean, safe drinking water.' },
      { icon: Wind, title: 'Air Filters', desc: 'HEPA, activated carbon, and industrial air filtration systems for any environment.' },
      { icon: Factory, title: 'Industrial Solutions', desc: 'Custom filtration systems for factories, plants, and large-scale operations.' },
      { icon: Gauge, title: 'High Performance', desc: 'Filters rated for 99.9% contaminant removal with long-lasting durability.' },
      { icon: Leaf, title: 'Eco-Friendly', desc: 'Sustainable materials and recyclable filter cartridges for a greener future.' },
      { icon: Award, title: 'Certified Quality', desc: 'All products meet international ISO and CE quality standards.' },
    ],
  },
  ru: {
    title: 'Почему FilterSystem?',
    subtitle: 'Мы объединяем десятилетия опыта фильтрации с современными технологиями производства',
    features: [
      { icon: Droplets, title: 'Водяные фильтры', desc: 'Обратный осмос, УФ, угольные и осадочные фильтры для чистой воды.' },
      { icon: Wind, title: 'Воздушные фильтры', desc: 'HEPA, угольные и промышленные системы фильтрации воздуха.' },
      { icon: Factory, title: 'Промышленные решения', desc: 'Индивидуальные системы фильтрации для заводов и крупных производств.' },
      { icon: Gauge, title: 'Высокая эффективность', desc: 'Фильтры с удалением 99.9% загрязнителей и долговечностью.' },
      { icon: Leaf, title: 'Экологичность', desc: 'Устойчивые материалы и перерабатываемые фильтрующие картриджи.' },
      { icon: Award, title: 'Сертифицированное качество', desc: 'Все продукты соответствуют стандартам ISO и CE.' },
    ],
  },
  uz: {
    title: 'Nega FilterSystem?',
    subtitle: "O'nlab yillik filtrlash tajribasini zamonaviy ishlab chiqarish texnologiyalari bilan birlashtiramiz",
    features: [
      { icon: Droplets, title: 'Suv filtrlari', desc: "Toza va xavfsiz ichimlik suvi uchun teskari osmos, UV, ko'mir filtrlari." },
      { icon: Wind, title: 'Havo filtrlari', desc: "HEPA, faollashtirilgan ko'mir va sanoat havo filtrlash tizimlari." },
      { icon: Factory, title: 'Sanoat yechimlari', desc: "Zavodlar va yirik korxonalar uchun maxsus filtrlash tizimlari." },
      { icon: Gauge, title: "Yuqori samaradorlik", desc: "99.9% ifloslanishni yo'qotish qobiliyatiga ega filtrlar." },
      { icon: Leaf, title: 'Ekologik toza', desc: "Barqaror materiallar va qayta ishlanadigan filtr kartrijlari." },
      { icon: Award, title: 'Sertifikatlangan sifat', desc: "Barcha mahsulotlar xalqaro ISO va CE standartlariga javob beradi." },
    ],
  },
  kz: {
    title: 'Неліктен FilterSystem?',
    subtitle: 'Ондаған жылдық сүзгілеу тәжірибесін заманауи өндіріс технологияларымен біріктіреміз',
    features: [
      { icon: Droplets, title: 'Су сүзгілері', desc: 'Таза және қауіпсіз ауыз су үшін кері осмос, УК, көмір сүзгілері.' },
      { icon: Wind, title: 'Ауа сүзгілері', desc: 'HEPA, белсендірілген көмір және өнеркәсіптік ауа сүзгілеу жүйелері.' },
      { icon: Factory, title: 'Өнеркәсіптік шешімдер', desc: 'Зауыттар мен ірі кәсіпорындар үшін арнайы сүзгілеу жүйелері.' },
      { icon: Gauge, title: 'Жоғары тиімділік', desc: '99.9% ластағыштарды жою қабілеті бар сүзгілер.' },
      { icon: Leaf, title: 'Экологиялық таза', desc: 'Тұрақты материалдар және қайта өңделетін сүзгі картридждері.' },
      { icon: Award, title: 'Сертификатталған сапа', desc: 'Барлық өнімдер халықаралық ISO және CE стандарттарына сай.' },
    ],
  },
};

export function WhyUs({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{c.title}</h2>
          <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">{c.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {c.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-xl border border-slate-200/80 bg-white p-6 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/40 hover:border-slate-300"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/[0.06] p-2.5 transition-colors duration-200 group-hover:bg-primary">
                <feature.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
