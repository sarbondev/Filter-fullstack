"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Bookmark,
  Menu,
  X,
  Filter,
  User,
  LogOut,
  Package,
  ChevronDown,
  Settings,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";
import { useAppSelector, useAppDispatch } from "@/shared/hooks";
import { clearAuth } from "@/store/authSlice";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

export function Navbar({ locale, dict }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);
  const auth = useAppSelector((s) => s.auth);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Is this the homepage? (transparent navbar at top)
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/blog`, label: dict.blog.title },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    setUserMenuOpen(false);
  };

  /* ── Style helpers based on transparent state ── */
  const headerBg = transparent
    ? "bg-transparent"
    : "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/20";

  const logoText = transparent ? "text-white" : "text-slate-900";
  const linkBase = transparent
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50";
  const linkActive = transparent
    ? "text-white bg-white/15"
    : "text-primary bg-primary/[0.06]";
  const iconBtn = transparent
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50";
  const authBtn = transparent
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100";
  const userBtnBg = transparent
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100";
  const badgeRing = transparent ? "ring-transparent" : "ring-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link href={`/${locale}`} className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary p-2">
                  <Filter className="h-4.5 w-4.5 text-white" />
                </div>
                <span
                  className={`text-lg font-bold tracking-tight transition-colors duration-300 ${logoText}`}
                >
                  Filter<span className="text-primary">System</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== `/${locale}` &&
                      pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive ? linkActive : linkBase
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <LanguageSwitcher
                currentLang={locale}
                transparent={transparent}
              />

              {/* User / Auth */}
              {auth.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`hidden sm:flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ${userBtnBg}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate text-[13px]">
                      {auth.user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1.5 w-52 rounded-lg bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900">
                            {auth.user.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {auth.user.phoneNumber}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href={`/${locale}/orders`}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Package className="h-4 w-4 text-slate-400" />
                            {dict.checkout.myOrders}
                          </Link>
                          <Link
                            href={`/${locale}/settings`}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Settings className="h-4 w-4 text-slate-400" />
                            {dict.settings.title}
                          </Link>
                          <div className="border-t border-slate-100 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              {dict.auth.logout}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className={`hidden sm:flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ${authBtn}`}
                >
                  <User
                    className={`h-4 w-4 ${transparent ? "text-white/60" : "text-slate-400"}`}
                  />
                  {dict.auth.login}
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href={`/${locale}/wishlist`}
                className={`relative flex items-center justify-center rounded-lg p-2.5 transition-colors duration-200 ${iconBtn}`}
              >
                <Bookmark className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ${badgeRing}`}
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className={`relative flex items-center justify-center rounded-lg p-2.5 transition-colors duration-200 ${iconBtn}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ${badgeRing}`}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className={`lg:hidden rounded-lg p-2.5 transition-colors duration-200 ${iconBtn}`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 shadow-lg shadow-slate-200/30 lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-3 gap-0.5">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `/${locale}` &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/[0.06]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={`/${locale}/wishlist`}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Bookmark className="h-4 w-4 text-slate-400" />
                {dict.wishlist.title}
                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs text-red-500 font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {auth.user ? (
                <>
                  <Link
                    href={`/${locale}/orders`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Package className="h-4 w-4 text-slate-400" />
                    {dict.checkout.myOrders}
                  </Link>
                  <Link
                    href={`/${locale}/settings`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    {dict.settings.title}
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {dict.auth.logout}
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/[0.04]"
                >
                  <User className="h-4 w-4" />
                  {dict.auth.login}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
