'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/formatPrice';
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkoutSchema';
import toast from 'react-hot-toast';
import { Loader2, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = getSubtotal();
  const shippingMethod = watch('shippingMethod', 'standard');
  const shipping = shippingMethod === 'express' ? 15.99 : subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const onSubmit = async (data: CheckoutInput) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: data.email,
          guestName: data.shippingAddress.fullName,
          items: items.map(item => ({
            productId: item.productId || item.id,
            variantId: item.variantId || item.id,
            quantity: item.quantity,
          })),
          shippingAddress: data.shippingAddress,
          shippingMethod: data.shippingMethod,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const { data: order } = await orderResponse.json();

      // Step 2: Create Stripe checkout session
      const checkoutResponse = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { data: session } = await checkoutResponse.json();

      // Step 3: Redirect to Stripe
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Contact & Shipping */}
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold text-xl mb-6">Contact & Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    disabled={isProcessing}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input {...register('shippingAddress.fullName')} disabled={isProcessing} />
                    {errors.shippingAddress?.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input {...register('shippingAddress.phone')} disabled={isProcessing} />
                    {errors.shippingAddress?.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 1</label>
                  <Input {...register('shippingAddress.addressLine1')} disabled={isProcessing} />
                  {errors.shippingAddress?.addressLine1 && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.shippingAddress.addressLine1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                  <Input {...register('shippingAddress.addressLine2')} disabled={isProcessing} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input {...register('shippingAddress.city')} disabled={isProcessing} />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input {...register('shippingAddress.state')} disabled={isProcessing} />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <Input {...register('shippingAddress.postalCode')} disabled={isProcessing} />
                    {errors.shippingAddress?.postalCode && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Input 
                    {...register('shippingAddress.country')} 
                    defaultValue="United States" 
                    disabled={isProcessing}
                  />
                  {errors.shippingAddress?.country && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.shippingAddress.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Method */}
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold text-xl mb-6">Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    {...register('shippingMethod')}
                    value="standard"
                    defaultChecked
                    disabled={isProcessing}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">5-7 business days</p>
                  </div>
                  <span className="font-semibold">
                    {subtotal > 50 ? 'FREE' : formatPrice(5.99)}
                  </span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input 
                    type="radio" 
                    {...register('shippingMethod')} 
                    value="express" 
                    disabled={isProcessing}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                  <span className="font-semibold">{formatPrice(15.99)}</span>
                </label>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-xl">Secure Payment</h2>
                  <p className="text-sm text-muted-foreground">Powered by Stripe</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="relative h-16 w-16 rounded bg-muted shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.size} / {item.color} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-center">
                <span className="font-semibold">Free shipping</span> on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
