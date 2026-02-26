'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  guestName: string;
  guestEmail: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: any;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Reload orders
        loadOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Orders ({orders.length})</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'border-[#C8A97E] bg-[#C8A97E]/5'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{order.guestName}</p>
                        <p className="text-sm text-gray-600">{order.guestEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono text-sm">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="font-semibold">{selectedOrder.guestName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.guestEmail}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress?.addressLine1}<br />
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <>{selectedOrder.shippingAddress.addressLine2}<br /></>
                    )}
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Update Status</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'PROCESSING')}
                      disabled={selectedOrder.status === 'PROCESSING'}
                      className="w-full"
                      variant={selectedOrder.status === 'PROCESSING' ? 'secondary' : 'default'}
                    >
                      Mark as Processing
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'SHIPPED')}
                      disabled={selectedOrder.status === 'SHIPPED'}
                      className="w-full"
                      variant={selectedOrder.status === 'SHIPPED' ? 'secondary' : 'default'}
                    >
                      Mark as Shipped
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                      disabled={selectedOrder.status === 'DELIVERED'}
                      className="w-full"
                      variant={selectedOrder.status === 'DELIVERED' ? 'secondary' : 'default'}
                    >
                      Mark as Delivered
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-gray-500 text-center py-8">
                Select an order to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
