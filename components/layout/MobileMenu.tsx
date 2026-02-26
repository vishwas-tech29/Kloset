'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

const menuLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/category/men', label: 'Men' },
  { href: '/category/women', label: 'Women' },
  { href: '/category/kids', label: 'Kids' },
  { href: '/category/sale', label: 'Sale', highlight: true },
];

export function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={toggleMobileMenu}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-background z-50 shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="text-2xl font-serif font-bold" onClick={toggleMobileMenu}>
                KLOSET
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={`block px-4 py-3 rounded-lg hover:bg-muted transition-colors ${
                    link.highlight ? 'text-destructive font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
              <Link href="/login" onClick={toggleMobileMenu}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={toggleMobileMenu}>
                <Button className="w-full">Create Account</Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
