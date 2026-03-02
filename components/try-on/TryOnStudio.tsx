'use client';

import { useState } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { GarmentSelector } from './GarmentSelector';
import { TryOnResult } from './TryOnResult';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

type Step = 'upload' | 'select' | 'result';

export function TryOnStudio() {
  const [step, setStep] = useState<Step>('upload');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = (photoUrl: string) => {
    setUserPhoto(photoUrl);
    setStep('select');
  };

  const handleProductSelect = async (product: any) => {
    setSelectedProduct(product);
    setIsProcessing(true);

    try {
      // Call AI try-on API
      const response = await fetch('/api/try-on/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImageUrl: userPhoto,
          garmentImageUrl: product.images[0]?.url || product.image,
          category: product.category?.name || 'clothing',
          productId: product.id,
          productName: product.name,
        }),
      });

      const data = await response.json();
      
      if (data.resultUrl) {
        setResultImage(data.resultUrl);
        setStep('result');
      } else {
        throw new Error('No result image received');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      alert('Failed to generate try-on. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setUserPhoto(null);
    setSelectedProduct(null);
    setResultImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <StepIndicator number={1} label="Upload Photo" active={step === 'upload'} completed={step !== 'upload'} />
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <StepIndicator number={2} label="Select Item" active={step === 'select'} completed={step === 'result'} />
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <StepIndicator number={3} label="View Result" active={step === 'result'} />
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <Card className="p-12 text-center mb-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI is working its magic...</h3>
          <p className="text-muted-foreground">This usually takes 15-30 seconds</p>
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </Card>
      )}

      {/* Step Content */}
      {!isProcessing && (
        <>
          {step === 'upload' && <PhotoUploader onPhotoUpload={handlePhotoUpload} />}
          {step === 'select' && (
            <GarmentSelector
              onProductSelect={handleProductSelect}
              userPhoto={userPhoto}
              onBack={() => setStep('upload')}
            />
          )}
          {step === 'result' && resultImage && (
            <TryOnResult
              userPhoto={userPhoto!}
              resultImage={resultImage}
              product={selectedProduct}
              onReset={handleReset}
              onTryAnother={() => setStep('select')}
            />
          )}
        </>
      )}
    </div>
  );
}

function StepIndicator({ number, label, active, completed }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
          active
            ? 'bg-primary text-white'
            : completed
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {number}
      </div>
      <span className={`text-sm ${active ? 'font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
}
