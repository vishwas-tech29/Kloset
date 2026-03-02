'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  isPublished: boolean;
  isFeatured: boolean;
  category: {
    name: string;
  };
  images: Array<{
    url: string;
  }>;
  variants: Array<{
    stock: number;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Product deleted successfully');
        loadProducts();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const totalStock = products.reduce(
    (sum, product) => sum + product.variants.reduce((s, v) => s + v.stock, 0),
    0
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Published</p>
          <p className="text-3xl font-bold">
            {products.filter((p) => p.isPublished).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Stock</p>
          <p className="text-3xl font-bold">{totalStock}</p>
        </Card>
      </div>

      {/* Products Grid */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">All Products</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <span className="text-lg font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {product.isPublished ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Stock: {product.variants.reduce((s, v) => s + v.stock, 0)} units
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/admin/products/edit?id=${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
