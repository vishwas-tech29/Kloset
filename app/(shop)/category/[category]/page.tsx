'use client';

import { ProductGrid } from '@/components/shop/ProductGrid';

// Mock data
const mockProducts = Array.from({ length: 8 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: 'High-quality clothing item',
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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">
          Discover our collection of {categoryName.toLowerCase()} clothing
        </p>
      </div>

      <ProductGrid products={mockProducts} />
    </div>
  );
}
