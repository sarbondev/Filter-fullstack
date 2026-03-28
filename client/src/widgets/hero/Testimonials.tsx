'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Locale } from '@/shared/types';

const content = {
  en: {
    title: 'What Our Clients Say',
    testimonials: [
      { name: 'Akmal Karimov', role: 'Factory Director, Tashkent', rating: 5, text: 'FilterSystem transformed our water purification line. The quality and reliability of their industrial filters is unmatched. Production efficiency improved by 40%.' },
      { name: 'Dilnoza Rashidova', role: 'Hotel Manager, Samarkand', rating: 5, text: 'We installed their water filtration system across our entire hotel. Guests immediately noticed the improvement. Excellent after-sales support.' },
      { name: 'Bobur Aliyev', role: 'Agricultural Engineer', rating: 5, text: 'Their irrigation filter systems have been running flawlessly for 3 years. The build quality is exceptional and maintenance is minimal.' },
      { name: 'Marina Petrova', role: 'Restaurant Chain Owner', rating: 5, text: 'Clean water is essential for our restaurants. FilterSystem provides consistent quality and their team responds within hours to any service call.' },
    ],
  },
  ru: {
    title: 'Что говорят наши клиенты',
    testimonials: [
      { name: 'Акмаль Каримов', role: 'Директор завода, Ташкент', rating: 5, text: 'FilterSystem преобразила нашу линию очистки воды. Качество и надёжность промышленных фильтров непревзойдённые. Эффективность выросла на 40%.' },
      { name: 'Дильноза Рашидова', role: 'Менеджер отеля, Самарканд', rating: 5, text: 'Мы установили систему фильтрации во всём отеле. Гости сразу заметили улучшение. Отличная послепродажная поддержка.' },
      { name: 'Бобур Алиев', role: 'Инженер-аграрий', rating: 5, text: 'Их системы фильтрации для ирригации безупречно работают уже 3 года. Качество сборки исключительное.' },
      { name: 'Марина Петрова', role: 'Владелица сети ресторанов', rating: 5, text: 'Чистая вода необходима для наших ресторанов. FilterSystem обеспечивает стабильное качество и быстрое обслуживание.' },
    ],
  },
  uz: {
    title: 'Mijozlarimiz nima deydi',
    testimonials: [
      { name: 'Akmal Karimov', role: 'Zavod direktori, Toshkent', rating: 5, text: "FilterSystem suv tozalash liniyamizni o'zgartirdi. Sanoat filtrlarining sifati va ishonchliligi tengsiz. Samaradorlik 40% ga oshdi." },
      { name: 'Dilnoza Rashidova', role: 'Mehmonxona menejeri, Samarqand', rating: 5, text: "Butun mehmonxonaga suv filtrlash tizimini o'rnatdik. Mehmonlar darhol yaxshilanishni sezdi. Ajoyib qo'llab-quvvatlash." },
      { name: 'Bobur Aliyev', role: 'Qishloq xo\'jaligi muhandisi', rating: 5, text: "Ularning sug'orish filtr tizimlari 3 yildan beri benuqson ishlaydi. Sifat ajoyib va texnik xizmat minimal." },
      { name: 'Marina Petrova', role: 'Restoran tarmog\'i egasi', rating: 5, text: "Toza suv restoranlarimiz uchun zarur. FilterSystem barqaror sifat va tezkor xizmat ko'rsatadi." },
    ],
  },
};

export function Testimonials({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{c.title}</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.text}</p>
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
