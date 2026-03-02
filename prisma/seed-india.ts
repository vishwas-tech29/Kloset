import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting India seed with INR prices...');

  // Create main categories (removed kids and sale)
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'men' },
      update: {},
      create: {
        name: "Men's Collection",
        slug: 'men',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'women' },
      update: {},
      create: {
        name: "Women's Collection",
        slug: 'women',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'printed' },
      update: {},
      create: {
        name: 'Printed Collection',
        slug: 'printed',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'embroidery' },
      update: {},
      create: {
        name: 'Embroidery Collection',
        slug: 'embroidery',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'custom' },
      update: {},
      create: {
        name: 'Custom Designs',
        slug: 'custom',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
        order: 5,
      },
    }),
  ]);

  console.log('Created categories');

  // Products with INR prices (USD * 83)
  const products = [
    // PRINTED COLLECTION - 3D Graphics & Modern Designs
    {
      name: '3D Geometric Print T-Shirt',
      slug: '3d-geometric-print-tshirt',
      description: 'Stunning 3D geometric patterns with depth illusion. Premium cotton with vibrant digital print. Modern streetwear essential.',
      price: 2499, // ₹2,499
      comparePrice: 3499,
      categoryId: categories[2].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', publicId: '3d-geo-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', publicId: '3d-geo-2', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 25, sku: '3DG-BLK-S' },
        { size: 'M', color: 'Black', stock: 30, sku: '3DG-BLK-M' },
        { size: 'L', color: 'Black', stock: 20, sku: '3DG-BLK-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: '3DG-BLK-XL' },
        { size: 'M', color: 'White', stock: 25, sku: '3DG-WHT-M' },
        { size: 'L', color: 'White', stock: 20, sku: '3DG-WHT-L' },
      ],
    },
    {
      name: 'Holographic Print Hoodie',
      slug: 'holographic-print-hoodie',
      description: 'Futuristic holographic print with color-shifting effects. Ultra-soft fleece interior. Stand out with this unique design.',
      price: 5999, // ₹5,999
      comparePrice: 7999,
      categoryId: categories[2].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'holo-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 15, sku: 'HOL-BLK-S' },
        { size: 'M', color: 'Black', stock: 20, sku: 'HOL-BLK-M' },
        { size: 'L', color: 'Black', stock: 18, sku: 'HOL-BLK-L' },
        { size: 'XL', color: 'Black', stock: 12, sku: 'HOL-BLK-XL' },
      ],
    },
    {
      name: 'Abstract 3D Art Sweatshirt',
      slug: 'abstract-3d-art-sweatshirt',
      description: 'Bold 3D abstract artwork with depth perception. Eye-catching design on premium sweatshirt. Perfect statement piece.',
      price: 4499, // ₹4,499
      categoryId: categories[2].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800', publicId: 'abstract-3d-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Navy', stock: 20, sku: 'ABS-NAV-M' },
        { size: 'L', color: 'Navy', stock: 15, sku: 'ABS-NAV-L' },
        { size: 'XL', color: 'Navy', stock: 10, sku: 'ABS-NAV-XL' },
      ],
    },
    {
      name: 'Neon Glow Print Tee',
      slug: 'neon-glow-print-tee',
      description: 'Vibrant neon graphics with glow-in-dark effect. Premium organic cotton. Perfect for night events and parties.',
      price: 2999, // ₹2,999
      categoryId: categories[2].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', publicId: 'neon-tee-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 18, sku: 'NEO-BLK-S' },
        { size: 'M', color: 'Black', stock: 25, sku: 'NEO-BLK-M' },
        { size: 'L', color: 'Black', stock: 20, sku: 'NEO-BLK-L' },
      ],
    },
    {
      name: 'Digital Wave Print',
      slug: 'digital-wave-print',
      description: 'Mesmerizing digital wave pattern with 3D effect. Modern tech-inspired design. Premium screen print on heavyweight cotton.',
      price: 3499, // ₹3,499
      comparePrice: 4499,
      categoryId: categories[2].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', publicId: 'wave-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 22, sku: 'WAV-BLK-S' },
        { size: 'M', color: 'Black', stock: 28, sku: 'WAV-BLK-M' },
        { size: 'L', color: 'Black', stock: 24, sku: 'WAV-BLK-L' },
        { size: 'XL', color: 'Black', stock: 18, sku: 'WAV-BLK-XL' },
      ],
    },

    // EMBROIDERY COLLECTION
    {
      name: 'Premium Logo Embroidered Polo',
      slug: 'premium-logo-embroidered-polo',
      description: 'Elegant embroidered logo on premium pique cotton polo. Perfect for smart-casual occasions. Superior craftsmanship.',
      price: 4999, // ₹4,999
      comparePrice: 6999,
      categoryId: categories[3].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800', publicId: 'polo-emb-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Navy', stock: 15, sku: 'PLE-NAV-S' },
        { size: 'M', color: 'Navy', stock: 20, sku: 'PLE-NAV-M' },
        { size: 'L', color: 'Navy', stock: 18, sku: 'PLE-NAV-L' },
        { size: 'M', color: 'White', stock: 20, sku: 'PLE-WHT-M' },
        { size: 'L', color: 'White', stock: 15, sku: 'PLE-WHT-L' },
      ],
    },
    {
      name: 'Floral Embroidery Hoodie',
      slug: 'floral-embroidery-hoodie',
      description: 'Delicate floral embroidery with intricate details. Handcrafted design on premium hoodie. Luxury meets comfort.',
      price: 6999, // ₹6,999
      comparePrice: 9999,
      categoryId: categories[3].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', publicId: 'floral-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 12, sku: 'FLE-BLK-S' },
        { size: 'M', color: 'Black', stock: 18, sku: 'FLE-BLK-M' },
        { size: 'L', color: 'Black', stock: 15, sku: 'FLE-BLK-L' },
      ],
    },
    {
      name: 'Monogram Embroidered Sweatshirt',
      slug: 'monogram-embroidered-sweatshirt',
      description: 'Personalized monogram embroidery on classic sweatshirt. Elegant and sophisticated. Make it uniquely yours.',
      price: 5499, // ₹5,499
      categoryId: categories[3].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', publicId: 'monogram-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Gray', stock: 20, sku: 'MON-GRY-M' },
        { size: 'L', color: 'Gray', stock: 16, sku: 'MON-GRY-L' },
        { size: 'XL', color: 'Gray', stock: 12, sku: 'MON-GRY-XL' },
      ],
    },
    {
      name: 'Heritage Crest Embroidered Jacket',
      slug: 'heritage-crest-embroidered-jacket',
      description: 'Premium jacket with detailed heritage crest embroidery. Luxury craftsmanship. Statement piece for your wardrobe.',
      price: 11999, // ₹11,999
      comparePrice: 15999,
      categoryId: categories[3].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', publicId: 'heritage-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Navy', stock: 8, sku: 'HER-NAV-M' },
        { size: 'L', color: 'Navy', stock: 10, sku: 'HER-NAV-L' },
        { size: 'XL', color: 'Navy', stock: 6, sku: 'HER-NAV-XL' },
      ],
    },
    {
      name: 'Minimalist Embroidered Tee',
      slug: 'minimalist-embroidered-tee',
      description: 'Subtle minimalist embroidery on premium cotton tee. Less is more. Understated elegance for everyday wear.',
      price: 3499, // ₹3,499
      categoryId: categories[3].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', publicId: 'minimal-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'White', stock: 20, sku: 'MIN-WHT-S' },
        { size: 'M', color: 'White', stock: 25, sku: 'MIN-WHT-M' },
        { size: 'L', color: 'White', stock: 20, sku: 'MIN-WHT-L' },
        { size: 'S', color: 'Black', stock: 18, sku: 'MIN-BLK-S' },
        { size: 'M', color: 'Black', stock: 22, sku: 'MIN-BLK-M' },
      ],
    },

    // MEN'S COLLECTION
    {
      name: 'Essential Cotton T-Shirt',
      slug: 'essential-cotton-tshirt',
      description: 'Wardrobe essential made from premium 100% cotton. Classic fit, superior comfort. Available in multiple colors.',
      price: 1999, // ₹1,999
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', publicId: 'essential-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 30, sku: 'ESS-BLK-S' },
        { size: 'M', color: 'Black', stock: 35, sku: 'ESS-BLK-M' },
        { size: 'L', color: 'Black', stock: 28, sku: 'ESS-BLK-L' },
        { size: 'XL', color: 'Black', stock: 20, sku: 'ESS-BLK-XL' },
        { size: 'M', color: 'White', stock: 30, sku: 'ESS-WHT-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'ESS-WHT-L' },
        { size: 'M', color: 'Navy', stock: 28, sku: 'ESS-NAV-M' },
        { size: 'L', color: 'Navy', stock: 22, sku: 'ESS-NAV-L' },
      ],
    },
    {
      name: 'Premium Pullover Hoodie',
      slug: 'premium-pullover-hoodie',
      description: 'Ultra-soft pullover hoodie with adjustable drawstring. Fleece-lined interior. Ultimate comfort for any season.',
      price: 4999, // ₹4,999
      comparePrice: 6999,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'premium-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 18, sku: 'PRE-BLK-S' },
        { size: 'M', color: 'Black', stock: 25, sku: 'PRE-BLK-M' },
        { size: 'L', color: 'Black', stock: 22, sku: 'PRE-BLK-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'PRE-BLK-XL' },
        { size: 'M', color: 'Gray', stock: 20, sku: 'PRE-GRY-M' },
        { size: 'L', color: 'Gray', stock: 18, sku: 'PRE-GRY-L' },
      ],
    },
    {
      name: 'Comfort Fit Sweatshirt',
      slug: 'comfort-fit-sweatshirt',
      description: 'Relaxed fit sweatshirt in soft cotton blend. Perfect for lounging or casual outings. Timeless design.',
      price: 3999, // ₹3,999
      categoryId: categories[0].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800', publicId: 'comfort-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Gray', stock: 22, sku: 'COM-GRY-M' },
        { size: 'L', color: 'Gray', stock: 20, sku: 'COM-GRY-L' },
        { size: 'XL', color: 'Gray', stock: 15, sku: 'COM-GRY-XL' },
        { size: 'M', color: 'Navy', stock: 18, sku: 'COM-NAV-M' },
        { size: 'L', color: 'Navy', stock: 16, sku: 'COM-NAV-L' },
      ],
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description: 'Modern slim fit jeans with stretch denim. Comfortable all-day wear. Classic 5-pocket design.',
      price: 6999, // ₹6,999
      categoryId: categories[0].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', publicId: 'jeans-1', order: 0 },
      ],
      variants: [
        { size: '30', color: 'Blue', stock: 12, sku: 'JEA-BLU-30' },
        { size: '32', color: 'Blue', stock: 18, sku: 'JEA-BLU-32' },
        { size: '34', color: 'Blue', stock: 15, sku: 'JEA-BLU-34' },
        { size: '36', color: 'Blue', stock: 10, sku: 'JEA-BLU-36' },
        { size: '32', color: 'Black', stock: 15, sku: 'JEA-BLK-32' },
        { size: '34', color: 'Black', stock: 12, sku: 'JEA-BLK-34' },
      ],
    },

    // WOMEN'S COLLECTION
    {
      name: 'Elegant Summer Dress',
      slug: 'elegant-summer-dress',
      description: 'Flowing summer dress in breathable fabric. Perfect for warm weather. Flattering silhouette with adjustable straps.',
      price: 5999, // ₹5,999
      comparePrice: 7999,
      categoryId: categories[1].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', publicId: 'dress-1', order: 0 },
      ],
      variants: [
        { size: 'XS', color: 'Floral', stock: 10, sku: 'DRE-FLR-XS' },
        { size: 'S', color: 'Floral', stock: 15, sku: 'DRE-FLR-S' },
        { size: 'M', color: 'Floral', stock: 12, sku: 'DRE-FLR-M' },
        { size: 'L', color: 'Floral', stock: 8, sku: 'DRE-FLR-L' },
      ],
    },
    {
      name: 'Classic White Blouse',
      slug: 'classic-white-blouse',
      description: 'Timeless white blouse in crisp cotton. Versatile piece for work or casual wear. Button-front design.',
      price: 3499, // ₹3,499
      categoryId: categories[1].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800', publicId: 'blouse-1', order: 0 },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 12, sku: 'BLO-WHT-XS' },
        { size: 'S', color: 'White', stock: 18, sku: 'BLO-WHT-S' },
        { size: 'M', color: 'White', stock: 20, sku: 'BLO-WHT-M' },
        { size: 'L', color: 'White', stock: 15, sku: 'BLO-WHT-L' },
      ],
    },
    {
      name: 'Cozy Knit Sweater',
      slug: 'cozy-knit-sweater',
      description: 'Soft knit sweater perfect for layering. Warm and comfortable. Classic crew neck design.',
      price: 4999, // ₹4,999
      categoryId: categories[1].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', publicId: 'sweater-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Beige', stock: 15, sku: 'SWE-BEI-S' },
        { size: 'M', color: 'Beige', stock: 20, sku: 'SWE-BEI-M' },
        { size: 'L', color: 'Beige', stock: 12, sku: 'SWE-BEI-L' },
      ],
    },

    // CUSTOM DESIGNS
    {
      name: 'Custom Text T-Shirt',
      slug: 'custom-text-tshirt',
      description: 'Personalize with your own text! High-quality print on premium cotton. Perfect for gifts or personal expression.',
      price: 2999, // ₹2,999
      categoryId: categories[4].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', publicId: 'custom-text-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'White', stock: 50, sku: 'CUS-WHT-S' },
        { size: 'M', color: 'White', stock: 60, sku: 'CUS-WHT-M' },
        { size: 'L', color: 'White', stock: 50, sku: 'CUS-WHT-L' },
        { size: 'XL', color: 'White', stock: 40, sku: 'CUS-WHT-XL' },
        { size: 'M', color: 'Black', stock: 55, sku: 'CUS-BLK-M' },
        { size: 'L', color: 'Black', stock: 45, sku: 'CUS-BLK-L' },
      ],
    },
    {
      name: 'Custom Logo Hoodie',
      slug: 'custom-logo-hoodie',
      description: 'Add your own logo or design! Professional printing on premium hoodie. Ideal for teams, events, or businesses.',
      price: 6499, // ₹6,499
      categoryId: categories[4].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'custom-logo-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 30, sku: 'CUL-BLK-S' },
        { size: 'M', color: 'Black', stock: 40, sku: 'CUL-BLK-M' },
        { size: 'L', color: 'Black', stock: 35, sku: 'CUL-BLK-L' },
        { size: 'XL', color: 'Black', stock: 25, sku: 'CUL-BLK-XL' },
      ],
    },
  ];

  console.log('Creating products...');

  for (const productData of products) {
    const { images, variants, ...product } = productData;
    
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
    });
  }

  console.log('Created all products');

  // Create coupons with INR
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minOrder: 3000, // ₹3,000
        maxUses: 100,
        isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'PRINT20' },
      update: {},
      create: {
        code: 'PRINT20',
        type: 'PERCENTAGE',
        value: 20,
        minOrder: 5000, // ₹5,000
        maxUses: 50,
        isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'EMBROIDERY15' },
      update: {},
      create: {
        code: 'EMBROIDERY15',
        type: 'PERCENTAGE',
        value: 15,
        minOrder: 7000, // ₹7,000
        maxUses: 30,
        isActive: true,
      },
    }),
  ]);

  console.log('Created coupons');
  console.log('✅ India seed with INR prices completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
