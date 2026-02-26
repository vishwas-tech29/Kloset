import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button size="lg">View Orders</Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
