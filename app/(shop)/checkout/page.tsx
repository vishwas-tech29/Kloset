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

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { items, getSubtotal, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutInput) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/checkout/success');
    } catch (error) {
      toast.error('Something went wrong');
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
              <h2 className="font-semibold text-xl mb-6">1. Contact & Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input {...register('shippingAddress.fullName')} />
                    {errors.shippingAddress?.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input {...register('shippingAddress.phone')} />
                    {errors.shippingAddress?.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 1</label>
                  <Input {...register('shippingAddress.addressLine1')} />
                  {errors.shippingAddress?.addressLine1 && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.shippingAddress.addressLine1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                  <Input {...register('shippingAddress.addressLine2')} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input {...register('shippingAddress.city')} />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input {...register('shippingAddress.state')} />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <Input {...register('shippingAddress.postalCode')} />
                    {errors.shippingAddress?.postalCode && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shippingAddress.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Input {...register('shippingAddress.country')} defaultValue="United States" />
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
              <h2 className="font-semibold text-xl mb-6">2. Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    {...register('shippingMethod')}
                    value="standard"
                    defaultChecked
                  />
                  <div className="flex-1">
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">5-7 business days</p>
                  </div>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" {...register('shippingMethod')} value="express" />
                  <div className="flex-1">
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                  <span className="font-semibold">{formatPrice(15.99)}</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold text-xl mb-6">3. Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <Input placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Place Order
            </Button>
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
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
