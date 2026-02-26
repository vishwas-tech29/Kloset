import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatPrice';
import { formatDate } from '@/lib/utils/formatDate';

const mockOrders = [
  { id: '1', orderNumber: 'ORD-1001', customer: 'John Doe', date: '2024-01-15', total: 129.99, status: 'delivered' },
  { id: '2', orderNumber: 'ORD-1002', customer: 'Jane Smith', date: '2024-01-20', total: 89.99, status: 'shipped' },
  { id: '3', orderNumber: 'ORD-1003', customer: 'Bob Johnson', date: '2024-01-25', total: 199.99, status: 'processing' },
  { id: '4', orderNumber: 'ORD-1004', customer: 'Alice Brown', date: '2024-01-28', total: 149.99, status: 'pending' },
];

const statusColors = {
  pending: 'secondary',
  processing: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
} as const;

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Orders</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Order</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Total</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4">{order.customer}</td>
                    <td className="p-4">{formatDate(order.date)}</td>
                    <td className="p-4">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
