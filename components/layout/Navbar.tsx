'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useUIStore } from '@/lib/store/uiStore';
import { SearchBar } from '@/components/shop/SearchBar';

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { toggleMobileMenu, toggleCartDrawer } = useUIStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/" className="text-2xl font-serif font-bold hover:text-primary transition-colors">
              KLOSET
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Shop All
              </Link>
              <Link href="/category/men" className="text-sm font-medium hover:text-primary transition-colors">
                Men
              </Link>
              <Link href="/category/women" className="text-sm font-medium hover:text-primary transition-colors">
                Women
              </Link>
              <Link href="/category/kids" className="text-sm font-medium hover:text-primary transition-colors">
                Kids
              </Link>
              <Link href="/category/sale" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                Sale
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar />

            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center animate-in zoom-in-50">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={toggleCartDrawer}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
