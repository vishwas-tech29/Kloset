'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { formatPrice, calculateDiscount } from '@/lib/utils/formatPrice';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

// Mock product data
const mockProduct = {
  id: 'product-1',
  name: 'Premium Cotton T-Shirt',
  slug: 'premium-cotton-tshirt',
  description: 'Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and style. Perfect for everyday wear.',
  price: 49.99,
  compareAtPrice: 69.99,
  category: 'men',
  tags: ['new', 'trending'],
  images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  variants: [
    { id: 'v1', size: 'S', color: 'Black', sku: 'TS-BLK-S', stock: 10 },
    { id: 'v2', size: 'M', color: 'Black', sku: 'TS-BLK-M', stock: 15 },
    { id: 'v3', size: 'L', color: 'Black', sku: 'TS-BLK-L', stock: 8 },
    { id: 'v4', size: 'S', color: 'White', sku: 'TS-WHT-S', stock: 12 },
    { id: 'v5', size: 'M', color: 'White', sku: 'TS-WHT-M', stock: 0 },
  ],
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  featured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  
  const inWishlist = isInWishlist(mockProduct.id);
  const discount = calculateDiscount(mockProduct.price, mockProduct.compareAtPrice);

  const sizes = [...new Set(mockProduct.variants.map(v => v.size))];
  const colors = [...new Set(mockProduct.variants.map(v => v.color))];

  const selectedVariant = mockProduct.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error('Selected variant is out of stock');
      return;
    }

    addItem({
      productId: mockProduct.id,
      name: mockProduct.name,
      slug: mockProduct.slug,
      price: mockProduct.price,
      image: mockProduct.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      variantId: selectedVariant.id,
    });

    toast.success('Added to cart!');
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(mockProduct.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(mockProduct.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden bg-muted border-2",
                  selectedImage === idx ? "border-primary" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">{mockProduct.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(mockProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockProduct.rating} ({mockProduct.reviewCount} reviews)
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleWishlist}>
              <Heart className={cn("h-6 w-6", inWishlist && "fill-red-500 text-red-500")} />
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(mockProduct.price)}</span>
            {mockProduct.compareAtPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(mockProduct.compareAtPrice)}
                </span>
                <Badge variant="destructive">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{mockProduct.description}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
