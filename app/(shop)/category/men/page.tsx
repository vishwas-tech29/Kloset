'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '@/components/shop/ProductGrid';

// Mock products for men's category
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `men-product-${i + 1}`,
  name: `Men's Product ${i + 1}`,
  slug: `mens-product-${i + 1}`,
  description: 'High-quality men\'s clothing item',
  price: 49.99 + i * 10,
  compareAtPrice: i % 3 === 0 ? 69.99 + i * 10 : undefined,
  category: 'men' as any,
  tags: ['new', 'trending'],
  images: ['/placeholder.jpg'],
  variants: [],
  rating: 4.5,
  reviewCount: 120,
  inStock: true,
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const subcategories = [
  {
    name: 'T-Shirts',
    href: '/category/men/tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    description: 'Comfortable everyday tees',
  },
  {
    name: 'Sweatshirts',
    href: '/category/men/sweatshirts',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    description: 'Cozy and stylish',
  },
  {
    name: 'Hoodies',
    href: '/category/men/hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    description: 'Perfect for layering',
  },
];

export default function MenCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Men&apos;s Collection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover premium men&apos;s clothing designed for comfort, style, and versatility
        </p>
      </div>

      {/* Subcategories */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subcategories.map((subcategory, i) => (
            <Link
              key={subcategory.name}
              href={subcategory.href}
              className="group relative h-96 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110 duration-500"
                style={{ backgroundImage: `url(${subcategory.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 z-10">
                <h3 className="font-serif text-3xl font-bold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {subcategory.name}
                </h3>
                <p className="text-white/90 text-sm mb-4">{subcategory.description}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold">All Men&apos;s Products</h2>
          <div className="flex gap-2">
            <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        <ProductGrid products={mockProducts} />
      </section>
    </div>
  );
}
