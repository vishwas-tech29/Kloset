'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart on success
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border rounded-lg p-6 mb-8 bg-card">
          <h2 className="font-semibold text-xl mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive an email confirmation with your order details shortly.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;re preparing your items for shipment. This usually takes 1-2 business days.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping Updates</h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Info (for debugging) */}
        {sessionId && (
          <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Order Reference: {sessionId.slice(-12)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="flex-1">
            <Button size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center p-6 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <p className="text-sm">
            <a href="mailto:support@kloset.com" className="text-primary hover:underline">
              support@kloset.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
