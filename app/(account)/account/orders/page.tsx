import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils/formatPrice';
import { formatDate } from '@/lib/utils/formatDate';

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-1001',
    date: '2024-01-15',
    total: 129.99,
    status: 'delivered' as const,
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD-1002',
    date: '2024-01-20',
    total: 89.99,
    status: 'shipped' as const,
    items: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-1003',
    date: '2024-01-25',
    total: 199.99,
    status: 'processing' as const,
    items: 4,
  },
];

const statusColors = {
  pending: 'secondary',
  processing: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
} as const;

export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{order.orderNumber}</h3>
                    <Badge variant={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.date)} • {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
