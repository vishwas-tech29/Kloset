'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface GarmentSelectorProps {
  onProductSelect: (product: any) => void;
  userPhoto: string | null;
  onBack: () => void;
}

export function GarmentSelector({ onProductSelect, userPhoto, onBack }: GarmentSelectorProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.category?.slug === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [
    { slug: 'all', name: 'All Items' },
    { slug: 'men', name: 'Men' },
    { slug: 'women', name: 'Women' },
    { slug: 'printed', name: 'Printed' },
    { slug: 'embroidery', name: 'Embroidery' },
  ];

  return (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Select Clothing Item</h2>
            <p className="text-muted-foreground">Choose what you want to try on</p>
          </div>
        </div>

        {/* Your Photo Preview */}
        {userPhoto && (
          <div className="mb-6 p-4 bg-muted rounded-lg flex items-center gap-4">
            <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0">
              <Image src={userPhoto} alt="Your photo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium">Your photo is ready</p>
              <p className="text-xs text-muted-foreground">Select an item to try it on</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
              className="whitespace-nowrap"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded mb-3" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all group"
              onClick={() => onProductSelect(product)}
            >
              <div className="relative aspect-[3/4] bg-muted rounded mb-3 overflow-hidden">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-primary font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
