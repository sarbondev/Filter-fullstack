"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/50 backdrop-blur-xl" : "bg-white/0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo + Nav */}
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2.5 group"
              >
                <div className="rounded-xl bg-primary p-2 shadow-sm shadow-primary/20 transition-shadow group-hover:shadow-md group-hover:shadow-primary/30">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Filter<span className="text-primary">System</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 rounded-full px-1.5 py-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== `/${locale}` &&
                      pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher currentLang={locale} />

              {/* User / Auth */}
              {auth.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 pl-1.5 pr-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate">
                      {auth.user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900">
                            {auth.user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {auth.user.phoneNumber}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href={`/${locale}/orders`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            {dict.checkout.myOrders}
                          </Link>
                          <Link
                            href={`/${locale}/settings`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            {dict.settings.title}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            {dict.auth.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {dict.auth.login}
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href={`/${locale}/wishlist`}
                className="relative flex items-center justify-center rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white"
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative flex items-center justify-center rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
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
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 shadow-lg lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/wishlist`}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Heart className="h-4 w-4" />
                {dict.wishlist.title}
                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs text-red-500 font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {auth.user ? (
                <>
                  <Link
                    href={`/${locale}/orders`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Package className="h-4 w-4" />
                    {dict.checkout.myOrders}
                  </Link>
                  <Link
                    href={`/${locale}/settings`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4" />
                    {dict.settings.title}
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {dict.auth.logout}
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-blue-50"
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
