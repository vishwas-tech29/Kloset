'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

export function TryOnHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/try-on/history?sessionId=${sessionId}`);
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionId = () => {
    let sessionId = localStorage.getItem('tryon_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('tryon_session_id', sessionId);
    }
    return sessionId;
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded mb-3" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No try-on history yet</p>
        <p className="text-sm text-muted-foreground">
          Your virtual try-ons will appear here
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Try-On History</h2>
        <p className="text-muted-foreground">
          {history.length} {history.length === 1 ? 'try-on' : 'try-ons'} saved
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <Card key={item.id} className="p-4 group">
            <div className="relative aspect-[3/4] bg-muted rounded mb-3 overflow-hidden">
              <Image
                src={item.resultImage}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-medium mb-1 line-clamp-2">{item.productName}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                View
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
