import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting complete seed...');

  // Create main categories
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

  // Complete product catalog
  const products = [
    // PRINTED COLLECTION
    {
      name: 'Vintage Logo Print T-Shirt',
      slug: 'vintage-logo-print-tshirt',
      description: 'Classic vintage-style logo print on premium cotton. Retro design meets modern comfort. Perfect for casual everyday wear.',
      price: 34.99,
      comparePrice: 44.99,
      categoryId: categories[2].id, // Printed
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', publicId: 'vintage-logo-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', publicId: 'vintage-logo-2', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 25, sku: 'VLP-BLK-S' },
        { size: 'M', color: 'Black', stock: 30, sku: 'VLP-BLK-M' },
        { size: 'L', color: 'Black', stock: 20, sku: 'VLP-BLK-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'VLP-BLK-XL' },
        { size: 'M', color: 'White', stock: 25, sku: 'VLP-WHT-M' },
        { size: 'L', color: 'White', stock: 20, sku: 'VLP-WHT-L' },
      ],
    },
    {
      name: 'Abstract Art Print Hoodie',
      slug: 'abstract-art-print-hoodie',
      description: 'Bold abstract artwork printed on ultra-soft hoodie. Stand out with this unique artistic design. Premium quality fleece interior.',
      price: 79.99,
      comparePrice: 99.99,
      categoryId: categories[2].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'abstract-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 15, sku: 'AAP-BLK-S' },
        { size: 'M', color: 'Black', stock: 20, sku: 'AAP-BLK-M' },
        { size: 'L', color: 'Black', stock: 18, sku: 'AAP-BLK-L' },
        { size: 'XL', color: 'Black', stock: 12, sku: 'AAP-BLK-XL' },
      ],
    },
    {
      name: 'Geometric Pattern Sweatshirt',
      slug: 'geometric-pattern-sweatshirt',
      description: 'Modern geometric patterns in vibrant colors. Eye-catching design on comfortable sweatshirt. Perfect for making a statement.',
      price: 64.99,
      categoryId: categories[2].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800', publicId: 'geometric-sweat-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Navy', stock: 20, sku: 'GPS-NAV-M' },
        { size: 'L', color: 'Navy', stock: 15, sku: 'GPS-NAV-L' },
        { size: 'XL', color: 'Navy', stock: 10, sku: 'GPS-NAV-XL' },
      ],
    },
    {
      name: 'Nature Print Organic Tee',
      slug: 'nature-print-organic-tee',
      description: 'Beautiful nature-inspired print on 100% organic cotton. Eco-friendly and stylish. Soft, breathable, and sustainable.',
      price: 39.99,
      categoryId: categories[2].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', publicId: 'nature-tee-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Green', stock: 18, sku: 'NPT-GRN-S' },
        { size: 'M', color: 'Green', stock: 25, sku: 'NPT-GRN-M' },
        { size: 'L', color: 'Green', stock: 20, sku: 'NPT-GRN-L' },
      ],
    },
    {
      name: 'Streetwear Graphic Print',
      slug: 'streetwear-graphic-print',
      description: 'Urban streetwear design with bold graphics. Premium screen print on heavyweight cotton. Street style essential.',
      price: 44.99,
      comparePrice: 54.99,
      categoryId: categories[2].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', publicId: 'streetwear-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 22, sku: 'SGP-BLK-S' },
        { size: 'M', color: 'Black', stock: 28, sku: 'SGP-BLK-M' },
        { size: 'L', color: 'Black', stock: 24, sku: 'SGP-BLK-L' },
        { size: 'XL', color: 'Black', stock: 18, sku: 'SGP-BLK-XL' },
      ],
    },

    // EMBROIDERY COLLECTION
    {
      name: 'Classic Logo Embroidered Polo',
      slug: 'classic-logo-embroidered-polo',
      description: 'Timeless polo shirt with elegant embroidered logo. Premium pique cotton. Perfect for smart-casual occasions.',
      price: 69.99,
      comparePrice: 89.99,
      categoryId: categories[3].id, // Embroidery
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800', publicId: 'polo-emb-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Navy', stock: 15, sku: 'CLE-NAV-S' },
        { size: 'M', color: 'Navy', stock: 20, sku: 'CLE-NAV-M' },
        { size: 'L', color: 'Navy', stock: 18, sku: 'CLE-NAV-L' },
        { size: 'M', color: 'White', stock: 20, sku: 'CLE-WHT-M' },
        { size: 'L', color: 'White', stock: 15, sku: 'CLE-WHT-L' },
      ],
    },
    {
      name: 'Floral Embroidery Hoodie',
      slug: 'floral-embroidery-hoodie',
      description: 'Delicate floral embroidery on premium hoodie. Intricate handcrafted design. Luxury meets comfort.',
      price: 89.99,
      comparePrice: 119.99,
      categoryId: categories[3].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', publicId: 'floral-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 12, sku: 'FEH-BLK-S' },
        { size: 'M', color: 'Black', stock: 18, sku: 'FEH-BLK-M' },
        { size: 'L', color: 'Black', stock: 15, sku: 'FEH-BLK-L' },
      ],
    },
    {
      name: 'Monogram Embroidered Sweatshirt',
      slug: 'monogram-embroidered-sweatshirt',
      description: 'Personalized monogram embroidery on classic sweatshirt. Elegant and sophisticated. Make it uniquely yours.',
      price: 74.99,
      categoryId: categories[3].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', publicId: 'monogram-sweat-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Gray', stock: 20, sku: 'MES-GRY-M' },
        { size: 'L', color: 'Gray', stock: 16, sku: 'MES-GRY-L' },
        { size: 'XL', color: 'Gray', stock: 12, sku: 'MES-GRY-XL' },
      ],
    },
    {
      name: 'Heritage Crest Embroidered Jacket',
      slug: 'heritage-crest-embroidered-jacket',
      description: 'Premium jacket with detailed heritage crest embroidery. Luxury craftsmanship. Statement piece for your wardrobe.',
      price: 149.99,
      comparePrice: 199.99,
      categoryId: categories[3].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', publicId: 'heritage-jacket-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Navy', stock: 8, sku: 'HCE-NAV-M' },
        { size: 'L', color: 'Navy', stock: 10, sku: 'HCE-NAV-L' },
        { size: 'XL', color: 'Navy', stock: 6, sku: 'HCE-NAV-XL' },
      ],
    },
    {
      name: 'Minimalist Embroidered Tee',
      slug: 'minimalist-embroidered-tee',
      description: 'Subtle minimalist embroidery on premium cotton tee. Less is more. Understated elegance.',
      price: 44.99,
      categoryId: categories[3].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', publicId: 'minimal-tee-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'White', stock: 20, sku: 'MET-WHT-S' },
        { size: 'M', color: 'White', stock: 25, sku: 'MET-WHT-M' },
        { size: 'L', color: 'White', stock: 20, sku: 'MET-WHT-L' },
        { size: 'S', color: 'Black', stock: 18, sku: 'MET-BLK-S' },
        { size: 'M', color: 'Black', stock: 22, sku: 'MET-BLK-M' },
      ],
    },

    // MEN'S COLLECTION
    {
      name: 'Essential Cotton T-Shirt',
      slug: 'essential-cotton-tshirt',
      description: 'Wardrobe essential made from premium 100% cotton. Classic fit, superior comfort. Available in multiple colors.',
      price: 29.99,
      categoryId: categories[0].id, // Men
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', publicId: 'essential-tee-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 30, sku: 'ECT-BLK-S' },
        { size: 'M', color: 'Black', stock: 35, sku: 'ECT-BLK-M' },
        { size: 'L', color: 'Black', stock: 28, sku: 'ECT-BLK-L' },
        { size: 'XL', color: 'Black', stock: 20, sku: 'ECT-BLK-XL' },
        { size: 'M', color: 'White', stock: 30, sku: 'ECT-WHT-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'ECT-WHT-L' },
        { size: 'M', color: 'Navy', stock: 28, sku: 'ECT-NAV-M' },
        { size: 'L', color: 'Navy', stock: 22, sku: 'ECT-NAV-L' },
      ],
    },
    {
      name: 'Premium Pullover Hoodie',
      slug: 'premium-pullover-hoodie',
      description: 'Ultra-soft pullover hoodie with adjustable drawstring. Fleece-lined interior. Ultimate comfort for any season.',
      price: 69.99,
      comparePrice: 89.99,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'premium-hoodie-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 18, sku: 'PPH-BLK-S' },
        { size: 'M', color: 'Black', stock: 25, sku: 'PPH-BLK-M' },
        { size: 'L', color: 'Black', stock: 22, sku: 'PPH-BLK-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'PPH-BLK-XL' },
        { size: 'M', color: 'Gray', stock: 20, sku: 'PPH-GRY-M' },
        { size: 'L', color: 'Gray', stock: 18, sku: 'PPH-GRY-L' },
      ],
    },
    {
      name: 'Comfort Fit Sweatshirt',
      slug: 'comfort-fit-sweatshirt',
      description: 'Relaxed fit sweatshirt in soft cotton blend. Perfect for lounging or casual outings. Timeless design.',
      price: 54.99,
      categoryId: categories[0].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800', publicId: 'comfort-sweat-1', order: 0 },
      ],
      variants: [
        { size: 'M', color: 'Gray', stock: 22, sku: 'CFS-GRY-M' },
        { size: 'L', color: 'Gray', stock: 20, sku: 'CFS-GRY-L' },
        { size: 'XL', color: 'Gray', stock: 15, sku: 'CFS-GRY-XL' },
        { size: 'M', color: 'Navy', stock: 18, sku: 'CFS-NAV-M' },
        { size: 'L', color: 'Navy', stock: 16, sku: 'CFS-NAV-L' },
      ],
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description: 'Modern slim fit jeans with stretch denim. Comfortable all-day wear. Classic 5-pocket design.',
      price: 89.99,
      categoryId: categories[0].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', publicId: 'slim-jeans-1', order: 0 },
      ],
      variants: [
        { size: '30', color: 'Blue', stock: 12, sku: 'SFJ-BLU-30' },
        { size: '32', color: 'Blue', stock: 18, sku: 'SFJ-BLU-32' },
        { size: '34', color: 'Blue', stock: 15, sku: 'SFJ-BLU-34' },
        { size: '36', color: 'Blue', stock: 10, sku: 'SFJ-BLU-36' },
        { size: '32', color: 'Black', stock: 15, sku: 'SFJ-BLK-32' },
        { size: '34', color: 'Black', stock: 12, sku: 'SFJ-BLK-34' },
      ],
    },

    // WOMEN'S COLLECTION
    {
      name: 'Elegant Summer Dress',
      slug: 'elegant-summer-dress',
      description: 'Flowing summer dress in breathable fabric. Perfect for warm weather. Flattering silhouette with adjustable straps.',
      price: 79.99,
      comparePrice: 99.99,
      categoryId: categories[1].id, // Women
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', publicId: 'summer-dress-1', order: 0 },
      ],
      variants: [
        { size: 'XS', color: 'Floral', stock: 10, sku: 'ESD-FLR-XS' },
        { size: 'S', color: 'Floral', stock: 15, sku: 'ESD-FLR-S' },
        { size: 'M', color: 'Floral', stock: 12, sku: 'ESD-FLR-M' },
        { size: 'L', color: 'Floral', stock: 8, sku: 'ESD-FLR-L' },
      ],
    },
    {
      name: 'Classic White Blouse',
      slug: 'classic-white-blouse',
      description: 'Timeless white blouse in crisp cotton. Versatile piece for work or casual wear. Button-front design.',
      price: 49.99,
      categoryId: categories[1].id,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800', publicId: 'white-blouse-1', order: 0 },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 12, sku: 'CWB-WHT-XS' },
        { size: 'S', color: 'White', stock: 18, sku: 'CWB-WHT-S' },
        { size: 'M', color: 'White', stock: 20, sku: 'CWB-WHT-M' },
        { size: 'L', color: 'White', stock: 15, sku: 'CWB-WHT-L' },
      ],
    },
    {
      name: 'Cozy Knit Sweater',
      slug: 'cozy-knit-sweater',
      description: 'Soft knit sweater perfect for layering. Warm and comfortable. Classic crew neck design.',
      price: 64.99,
      categoryId: categories[1].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', publicId: 'knit-sweater-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Beige', stock: 15, sku: 'CKS-BEI-S' },
        { size: 'M', color: 'Beige', stock: 20, sku: 'CKS-BEI-M' },
        { size: 'L', color: 'Beige', stock: 12, sku: 'CKS-BEI-L' },
      ],
    },

    // CUSTOM DESIGNS
    {
      name: 'Custom Text T-Shirt',
      slug: 'custom-text-tshirt',
      description: 'Personalize with your own text! High-quality print on premium cotton. Perfect for gifts or personal expression.',
      price: 39.99,
      categoryId: categories[4].id, // Custom
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', publicId: 'custom-text-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'White', stock: 50, sku: 'CTT-WHT-S' },
        { size: 'M', color: 'White', stock: 60, sku: 'CTT-WHT-M' },
        { size: 'L', color: 'White', stock: 50, sku: 'CTT-WHT-L' },
        { size: 'XL', color: 'White', stock: 40, sku: 'CTT-WHT-XL' },
        { size: 'M', color: 'Black', stock: 55, sku: 'CTT-BLK-M' },
        { size: 'L', color: 'Black', stock: 45, sku: 'CTT-BLK-L' },
      ],
    },
    {
      name: 'Custom Logo Hoodie',
      slug: 'custom-logo-hoodie',
      description: 'Add your own logo or design! Professional printing on premium hoodie. Ideal for teams, events, or businesses.',
      price: 84.99,
      categoryId: categories[4].id,
      isPublished: true,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', publicId: 'custom-logo-1', order: 0 },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 30, sku: 'CLH-BLK-S' },
        { size: 'M', color: 'Black', stock: 40, sku: 'CLH-BLK-M' },
        { size: 'L', color: 'Black', stock: 35, sku: 'CLH-BLK-L' },
        { size: 'XL', color: 'Black', stock: 25, sku: 'CLH-BLK-XL' },
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

  // Create sample coupons
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minOrder: 50,
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
        minOrder: 75,
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
        minOrder: 100,
        maxUses: 30,
        isActive: true,
      },
    }),
  ]);

  console.log('Created coupons');
  console.log('✅ Complete seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
