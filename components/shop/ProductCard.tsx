'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, calculateDiscount } from '@/lib/utils/formatPrice';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const discount = product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
      >
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-3 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground shadow-lg">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="shadow-lg">
                Out of Stock
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground shadow-lg">
                Featured
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 flex flex-col gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white",
                inWishlist && "text-red-500"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Quick Add Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <Button className="w-full" size="sm">
              Quick Add
            </Button>
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span>({product.reviewCount})</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
