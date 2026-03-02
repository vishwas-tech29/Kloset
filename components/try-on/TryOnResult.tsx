'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, ShoppingCart, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

interface TryOnResultProps {
  userPhoto: string;
  resultImage: string;
  product: any;
  onReset: () => void;
  onTryAnother: () => void;
}

export function TryOnResult({
  userPhoto,
  resultImage,
  product,
  onReset,
  onTryAnother,
}: TryOnResultProps) {
  const [showComparison, setShowComparison] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `tryon-${product.slug}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Try-On: ${product.name}`,
          text: `Check out how I look in ${product.name} from Kloset!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        variant: product.variants[0],
        quantity: 1,
      });
      alert('Added to cart!');
    } else {
      alert('Please select a size from the product page');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Your Virtual Try-On Result</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Here&apos;s how {product.name} looks on you!
        </p>

        {/* Result Image */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Before */}
          {showComparison && (
            <div>
              <p className="text-sm font-medium mb-2">Original Photo</p>
              <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <Image src={userPhoto} alt="Original" fill className="object-cover" />
              </div>
            </div>
          )}

          {/* After */}
          <div className={showComparison ? '' : 'md:col-span-2'}>
            <p className="text-sm font-medium mb-2">With {product.name}</p>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <Image src={resultImage} alt="Try-on result" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Toggle Comparison */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-4 bg-muted rounded-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-24 rounded overflow-hidden flex-shrink-0">
              <Image
                src={product.images?.[0]?.url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={handleAddToCart} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={onTryAnother} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Another
          </Button>
        </div>

        {/* View Product */}
        <div className="mt-4">
          <Link href={`/products/${product.slug}`}>
            <Button variant="secondary" className="w-full">
              View Product Details
            </Button>
          </Link>
        </div>

        {/* Start Over */}
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
            Start Over with New Photo
          </Button>
        </div>
      </Card>

      {/* Size Recommendation */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Size Recommendation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on the try-on, we recommend checking the size guide on the product page for the best fit.
        </p>
        <div className="flex gap-2">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <div
              key={size}
              className="flex-1 p-3 border rounded text-center hover:border-primary cursor-pointer transition-colors"
            >
              <p className="font-medium">{size}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
