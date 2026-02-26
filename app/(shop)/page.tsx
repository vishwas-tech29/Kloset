import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TruckIcon, ShieldCheck, Headphones } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://cdn.coverr.co/videos/coverr-fashion-model-walking-in-studio-7525/1080p.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>New Season Collection</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              Elevate Your Style
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Discover premium clothing that combines comfort, quality, and timeless design. Shop the latest trends for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/products">
                <Button size="lg" className="group bg-white text-black hover:bg-white/90">
                  Shop Now 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/category/sale">
                <Button size="lg" variant="outline" className="group border-white text-white hover:bg-white/10">
                  View Sale
                  <span className="ml-2 text-red-400">-50%</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TruckIcon, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer service' },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-serif text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed for every style and occasion
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              name: 'Men', 
              href: '/category/men', 
              image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=800&fit=crop',
            },
            { 
              name: 'Women', 
              href: '/category/women', 
              image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
            },
            { 
              name: 'Kids', 
              href: '/category/kids', 
              image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop',
            },
            { 
              name: 'Sale', 
              href: '/category/sale', 
              image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=800&fit=crop',
            },
          ].map((category, i) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative h-80 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110 duration-500"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-20 space-y-2">
                <h3 className="font-serif text-4xl font-bold text-white transform group-hover:scale-110 transition-transform duration-300">
                  {category.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    Explore Collection
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Free Shipping on Orders Over $50
            </h2>
            <p className="text-lg opacity-90">
              Shop now and enjoy complimentary delivery to your doorstep. Limited time offer!
            </p>
            <Link href="/products">
              <Button size="lg" variant="secondary" className="group">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6 p-8 rounded-2xl border bg-card">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold">Join Our Newsletter</h2>
          <p className="text-muted-foreground">
            Subscribe to get special offers, free giveaways, and exclusive deals delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="lg">Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
    </div>
  );
}
