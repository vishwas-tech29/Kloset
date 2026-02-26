'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/shop/ProductGrid';

const mockProducts = Array.from({ length: 8 }, (_, i) => ({
  id: `sweatshirt-${i + 1}`,
  name: `Men's Sweatshirt ${i + 1}`,
  slug: `mens-sweatshirt-${i + 1}`,
  description: 'Cozy sweatshirt perfect for layering',
  price: 59.99 + i * 10,
  compareAtPrice: i % 2 === 0 ? 79.99 + i * 10 : undefined,
  category: 'men' as any,
  tags: ['sweatshirts', 'casual'],
  images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop'],
  variants: [],
  rating: 4.7,
  reviewCount: 92,
  inStock: true,
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export default function SweatshirtsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/category/men" className="hover:text-foreground">Men</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Sweatshirts</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Men's Sweatshirts</h1>
        <p className="text-muted-foreground text-lg">
          Stay warm and stylish with our premium sweatshirt collection
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-full border border-input hover:bg-muted text-sm">
            All Sizes
          </button>
          <button className="px-4 py-2 rounded-full border border-input hover:bg-muted text-sm">
            All Colors
          </button>
          <button className="px-4 py-2 rounded-full border border-input hover:bg-muted text-sm">
            Price Range
          </button>
        </div>
        <select className="md:ml-auto px-4 py-2 rounded-lg border border-input bg-background text-sm">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>

      {/* Products */}
      <ProductGrid products={mockProducts} />
    </div>
  );
}
