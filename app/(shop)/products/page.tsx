'use client';

import { useState } from 'react';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

// Mock data - replace with actual API call
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: 'High-quality clothing item',
  price: 49.99 + i * 10,
  compareAtPrice: i % 3 === 0 ? 69.99 + i * 10 : undefined,
  category: ['men', 'women', 'kids'][i % 3] as any,
  tags: ['new', 'trending'],
  images: ['/placeholder.jpg'],
  variants: [],
  rating: 4.5,
  reviewCount: 120,
  inStock: i % 5 !== 0,
  featured: i % 4 === 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">{mockProducts.length} products</p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <aside className="w-64 shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {['Men', 'Women', 'Kids', 'Sale'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map((range) => (
                    <label key={range} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <Button key={size} variant="outline" size="sm">
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        <div className="flex-1">
          <ProductGrid products={mockProducts} />
        </div>
      </div>
    </div>
  );
}
