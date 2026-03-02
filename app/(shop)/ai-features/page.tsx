'use client';

import Link from 'next/link';
import { Sparkles, Wand2, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AIFeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Virtual Try-On',
      description: 'See how clothes look on you before buying. Upload your photo or use your webcam for instant AI-powered try-on.',
      href: '/try-on',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Instant visualization', 'Size recommendations', 'Save & share results'],
    },
    {
      icon: Wand2,
      title: 'Design Studio',
      description: 'Create custom clothing designs with AI. Generate unique patterns, add text, and order your personalized items.',
      href: '/design-studio',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['AI-generated designs', 'Full canvas editor', '3D preview'],
    },
    {
      icon: MessageCircle,
      title: 'Fashion Expert',
      description: 'Chat with your personal AI stylist. Get outfit recommendations, styling tips, and fashion advice tailored to you.',
      href: '/fashion-expert',
      color: 'from-orange-500 to-red-500',
      benefits: ['Personalized advice', 'Outfit suggestions', 'Style memory'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Shop Smarter with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Features
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Experience the future of online shopping with our AI-powered tools. Try on clothes virtually, 
            design custom items, and get personalized fashion advice.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href={feature.href}>
                  <Button className="w-full group-hover:gap-3 transition-all">
                    Try Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-card rounded-2xl p-8 md:p-12 border">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose Your Tool</h3>
              <p className="text-sm text-muted-foreground">
                Select from Virtual Try-On, Design Studio, or Fashion Expert
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Let AI Work</h3>
              <p className="text-sm text-muted-foreground">
                Our advanced AI processes your request in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">
                View, save, share, or shop based on AI recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Shopping?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of shoppers using AI to find their perfect style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/try-on">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Start Virtual Try-On
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-white/10 hover:bg-white/20 text-white border-white/30">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
