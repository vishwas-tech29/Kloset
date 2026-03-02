'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState<string[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setProduct((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== index),
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          newImages,
        }),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product details, images, and pricing</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>

          {/* Current Images */}
          {product.images && product.images.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Current Images</p>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index, false)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">New Images (Not Saved Yet)</p>
              <div className="grid grid-cols-2 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image src={image} alt={`New ${index + 1}`} fill className="object-cover" />
                    <button
                      onClick={() => removeImage(index, true)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload new product images
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button type="button" onClick={() => document.getElementById('image-upload')?.click()}>
                Choose Files
              </Button>
            </label>
          </div>
        </Card>

        {/* Details Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Product Name</label>
              <Input
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter product description"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background min-h-[100px]"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                <Input
                  type="number"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Compare Price (₹)</label>
                <Input
                  type="number"
                  value={product.comparePrice || ''}
                  onChange={(e) =>
                    setProduct({ ...product, comparePrice: parseFloat(e.target.value) || null })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={product.category?.slug || ''}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    categoryId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="printed">Printed</option>
                <option value="embroidery">Embroidery</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Published Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={product.isPublished}
                onChange={(e) => setProduct({ ...product, isPublished: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published (visible to customers)
              </label>
            </div>

            {/* Featured Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={product.isFeatured}
                onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured (show on homepage)
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end gap-4">
        <Link href="/admin/products">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
