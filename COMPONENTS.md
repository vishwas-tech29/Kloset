# Component Reference

## UI Components (shadcn/ui)

Located in `components/ui/`

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">Click me</Button>
```
Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
Sizes: `default`, `sm`, `lg`, `icon`

### Input
```tsx
import { Input } from '@/components/ui/input';

<Input type="email" placeholder="Email" />
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">New</Badge>
```
Variants: `default`, `secondary`, `destructive`, `outline`

## Layout Components

Located in `components/layout/`

### Navbar
```tsx
import { Navbar } from '@/components/layout/Navbar';

<Navbar />
```
Features:
- Logo and navigation links
- Search button
- User account link
- Wishlist with count
- Cart with count
- Mobile menu toggle

### Footer
```tsx
import { Footer } from '@/components/layout/Footer';

<Footer />
```
Features:
- Brand information
- Navigation links
- Social media links
- Newsletter signup
- Copyright and legal links

### CartDrawer
```tsx
import { CartDrawer } from '@/components/layout/CartDrawer';

<CartDrawer />
```
Features:
- Slide-in animation
- Cart items list
- Quantity adjustment
- Remove items
- Subtotal and total
- Checkout button
- Empty state

## Shop Components

Located in `components/shop/`

### ProductCard
```tsx
import { ProductCard } from '@/components/shop/ProductCard';

<ProductCard product={product} />
```
Props:
- `product`: Product object

Features:
- Product image with hover effect
- Wishlist toggle
- Discount badge
- Out of stock badge
- Price display with compare-at price

### ProductGrid
```tsx
import { ProductGrid } from '@/components/shop/ProductGrid';

<ProductGrid products={products} />
```
Props:
- `products`: Array of Product objects

Features:
- Responsive grid (2-3-4 columns)
- Empty state
- Maps over products to render ProductCard

## Hooks

### useCartStore
```tsx
import { useCartStore } from '@/lib/store/cartStore';

const { items, addItem, removeItem, updateQuantity } = useCartStore();
```

Methods:
- `addItem(item)`: Add item to cart
- `removeItem(id)`: Remove item from cart
- `updateQuantity(id, quantity)`: Update item quantity
- `clearCart()`: Clear all items
- `getSubtotal()`: Calculate subtotal
- `getTotal()`: Calculate total with shipping

### useWishlistStore
```tsx
import { useWishlistStore } from '@/lib/store/wishlistStore';

const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
```

Methods:
- `addItem(productId)`: Add to wishlist
- `removeItem(productId)`: Remove from wishlist
- `isInWishlist(productId)`: Check if in wishlist
- `clearWishlist()`: Clear wishlist

### useUIStore
```tsx
import { useUIStore } from '@/lib/store/uiStore';

const { isCartDrawerOpen, toggleCartDrawer } = useUIStore();
```

Methods:
- `toggleMobileMenu()`: Toggle mobile menu
- `toggleCartDrawer()`: Toggle cart drawer
- `toggleSearch()`: Toggle search
- `closeAll()`: Close all UI elements

## Utilities

### formatPrice
```tsx
import { formatPrice } from '@/lib/utils/formatPrice';

formatPrice(49.99); // "$49.99"
```

### calculateDiscount
```tsx
import { calculateDiscount } from '@/lib/utils/formatPrice';

calculateDiscount(49.99, 69.99); // 29 (percent)
```

### formatDate
```tsx
import { formatDate } from '@/lib/utils/formatDate';

formatDate('2024-01-15'); // "January 15, 2024"
```

### cn (className utility)
```tsx
import { cn } from '@/lib/utils/cn';

cn('base-class', condition && 'conditional-class', 'another-class');
```

## Validation Schemas

### Login Schema
```tsx
import { loginSchema, type LoginInput } from '@/lib/validations/authSchemas';

const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

### Register Schema
```tsx
import { registerSchema, type RegisterInput } from '@/lib/validations/authSchemas';
```

### Checkout Schema
```tsx
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkoutSchema';
```

### Address Schema
```tsx
import { addressSchema, type AddressInput } from '@/lib/validations/checkoutSchema';
```

## Types

### Product
```tsx
import { Product } from '@/types/product';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### CartItem
```tsx
import { CartItem } from '@/types/cart';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  variantId: string;
}
```

### Order
```tsx
import { Order } from '@/types/order';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Usage Examples

### Adding to Cart
```tsx
'use client';

import { useCartStore } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function AddToCartButton({ product, variant }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      quantity: 1,
      variantId: variant.id,
    });
    toast.success('Added to cart!');
  };

  return <Button onClick={handleAddToCart}>Add to Cart</Button>;
}
```

### Wishlist Toggle
```tsx
'use client';

import { useWishlistStore } from '@/lib/store/wishlistStore';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WishlistButton({ productId }) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const inWishlist = isInWishlist(productId);

  const toggle = () => {
    if (inWishlist) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <Heart className={inWishlist ? 'fill-red-500 text-red-500' : ''} />
    </Button>
  );
}
```

### Form with Validation
```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <Input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      
      <Button type="submit">Login</Button>
    </form>
  );
}
```

## Styling Guidelines

### Tailwind Classes
- Use `container mx-auto px-4` for page containers
- Use `font-serif` for headings (Playfair Display)
- Use `font-sans` for body text (Inter)
- Primary color: `bg-primary text-primary-foreground`
- Muted backgrounds: `bg-muted`
- Borders: `border` (uses CSS variable)

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns
```tsx
// Card with hover effect
<div className="rounded-lg border bg-card hover:shadow-lg transition-shadow">

// Button group
<div className="flex gap-2">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Centered content
<div className="flex items-center justify-center min-h-screen">
```

## Best Practices

1. Always use `'use client'` directive for components with hooks or interactivity
2. Import types from `@/types/` directory
3. Use Zustand stores for global state
4. Use TanStack Query for server state
5. Validate forms with Zod schemas
6. Show toast notifications for user actions
7. Handle loading and error states
8. Make components responsive
9. Add proper TypeScript types
10. Use semantic HTML elements
