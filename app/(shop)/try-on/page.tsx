'use client';

import { useState } from 'react';
import { TryOnStudio } from '@/components/try-on/TryOnStudio';
import { TryOnHistory } from '@/components/try-on/TryOnHistory';
import { Sparkles, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TryOnPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Virtual Try-On</h1>
            </div>
            <p className="text-muted-foreground">
              See how clothes look on you before buying
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'Studio' : 'History'}
          </Button>
        </div>

        {/* Content */}
        {showHistory ? <TryOnHistory /> : <TryOnStudio />}
      </div>
    </div>
  );
}
