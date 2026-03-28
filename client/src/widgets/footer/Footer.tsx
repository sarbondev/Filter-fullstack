import Link from 'next/link';
import { Filter, Mail, Phone, MapPin } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-xl bg-primary p-2">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FilterSystem</span>
            </div>
            <p className="text-sm leading-relaxed">{dict.footer.description}</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {dict.footer.address}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                {dict.footer.phone}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                {dict.footer.email}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{dict.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${locale}`} className="text-sm hover:text-primary transition-colors">{dict.nav.home}</Link></li>
              <li><Link href={`/${locale}/products`} className="text-sm hover:text-primary transition-colors">{dict.nav.products}</Link></li>
              <li><Link href={`/${locale}/categories`} className="text-sm hover:text-primary transition-colors">{dict.nav.categories}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{dict.footer.support}</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-slate-400">{dict.footer.faq}</span></li>
              <li><span className="text-sm text-slate-400">{dict.footer.shippingInfo}</span></li>
              <li><span className="text-sm text-slate-400">{dict.footer.returns}</span></li>
              <li><span className="text-sm text-slate-400">{dict.footer.contactUs}</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{dict.footer.followUs}</h3>
            <p className="text-sm mb-4">Stay updated with our latest products and offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
              />
              <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          © {new Date().getFullYear()} FilterSystem. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
