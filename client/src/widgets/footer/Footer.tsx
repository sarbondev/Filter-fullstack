import Link from "next/link";
import { Filter, Mail, Phone, MapPin } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo.png" alt="FilterSystem Logo" />
            <p className="text-sm leading-relaxed text-slate-500">
              {dict.footer.description}
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{dict.footer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{dict.footer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{dict.footer.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {dict.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/categories`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {dict.nav.categories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              {dict.footer.support}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm">{dict.footer.faq}</span>
              </li>
              <li>
                <span className="text-sm">{dict.footer.shippingInfo}</span>
              </li>
              <li>
                <span className="text-sm">{dict.footer.returns}</span>
              </li>
              <li>
                <span className="text-sm">{dict.footer.contactUs}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              {dict.footer.followUs}
            </h3>
            <p className="text-sm mb-4 text-slate-500">
              {dict.footer.newsletter}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800/60 pt-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} FilterSystem. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
