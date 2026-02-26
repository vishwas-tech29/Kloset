import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'men' },
      update: {},
      create: {
        name: 'Men',
        slug: 'men',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'women' },
      update: {},
      create: {
        name: 'Women',
        slug: 'women',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kids' },
      update: {},
      create: {
        name: 'Kids',
        slug: 'kids',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sale' },
      update: {},
      create: {
        name: 'Sale',
        slug: 'sale',
        order: 4,
      },
    }),
  ]);

  console.log('Created categories');

  // Create sample products
  const products = [
    // Men's T-Shirts
    {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-tshirt',
      description: 'Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and style. Perfect for everyday wear.',
      price: 29.99,
      comparePrice: 39.99,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      variants: [
        { size: 'S', color: 'Black', stock: 10, sku: 'TS-BLK-S' },
        { size: 'M', color: 'Black', stock: 15, sku: 'TS-BLK-M' },
        { size: 'L', color: 'Black', stock: 8, sku: 'TS-BLK-L' },
        { size: 'S', color: 'White', stock: 12, sku: 'TS-WHT-S' },
        { size: 'M', color: 'White', stock: 20, sku: 'TS-WHT-M' },
        { size: 'L', color: 'White', stock: 10, sku: 'TS-WHT-L' },
      ],
    },
    {
      name: 'Classic Crew Neck Tee',
      slug: 'classic-crew-neck-tee',
      description: 'Timeless crew neck t-shirt with a relaxed fit. Essential wardrobe staple.',
      price: 24.99,
      categoryId: categories[0].id,
      isPublished: true,
      variants: [
        { size: 'S', color: 'Navy', stock: 15, sku: 'CT-NAV-S' },
        { size: 'M', color: 'Navy', stock: 20, sku: 'CT-NAV-M' },
        { size: 'L', color: 'Navy', stock: 12, sku: 'CT-NAV-L' },
      ],
    },
    // Men's Sweatshirts
    {
      name: 'Essential Crewneck Sweatshirt',
      slug: 'essential-crewneck-sweatshirt',
      description: 'Cozy crewneck sweatshirt made from soft fleece. Perfect for layering.',
      price: 59.99,
      comparePrice: 79.99,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      variants: [
        { size: 'S', color: 'Gray', stock: 8, sku: 'SW-GRY-S' },
        { size: 'M', color: 'Gray', stock: 12, sku: 'SW-GRY-M' },
        { size: 'L', color: 'Gray', stock: 10, sku: 'SW-GRY-L' },
        { size: 'XL', color: 'Gray', stock: 6, sku: 'SW-GRY-XL' },
      ],
    },
    // Men's Hoodies
    {
      name: 'Premium Pullover Hoodie',
      slug: 'premium-pullover-hoodie',
      description: 'Ultra-soft pullover hoodie with adjustable drawstring. Ultimate comfort meets style.',
      price: 69.99,
      comparePrice: 89.99,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      variants: [
        { size: 'S', color: 'Black', stock: 10, sku: 'HD-BLK-S' },
        { size: 'M', color: 'Black', stock: 15, sku: 'HD-BLK-M' },
        { size: 'L', color: 'Black', stock: 12, sku: 'HD-BLK-L' },
        { size: 'M', color: 'Charcoal', stock: 10, sku: 'HD-CHR-M' },
        { size: 'L', color: 'Charcoal', stock: 8, sku: 'HD-CHR-L' },
      ],
    },
    {
      name: 'Zip-Up Hoodie',
      slug: 'zip-up-hoodie',
      description: 'Versatile zip-up hoodie with side pockets. Perfect for active lifestyle.',
      price: 74.99,
      categoryId: categories[0].id,
      isPublished: true,
      variants: [
        { size: 'M', color: 'Navy', stock: 12, sku: 'ZH-NAV-M' },
        { size: 'L', color: 'Navy', stock: 10, sku: 'ZH-NAV-L' },
        { size: 'XL', color: 'Navy', stock: 8, sku: 'ZH-NAV-XL' },
      ],
    },
    // Men's Jeans
    {
      name: 'Slim Fit Jeans',
      slug: 'slim-fit-jeans',
      description: 'Classic slim fit jeans with stretch denim for all-day comfort.',
      price: 89.99,
      categoryId: categories[0].id,
      isPublished: true,
      variants: [
        { size: '30', color: 'Blue', stock: 5, sku: 'JN-BLU-30' },
        { size: '32', color: 'Blue', stock: 8, sku: 'JN-BLU-32' },
        { size: '34', color: 'Blue', stock: 6, sku: 'JN-BLU-34' },
      ],
    },
    // Women's Products
    {
      name: 'Summer Dress',
      slug: 'summer-dress',
      description: 'Light and breezy summer dress perfect for warm weather.',
      price: 79.99,
      comparePrice: 99.99,
      categoryId: categories[1].id,
      isPublished: true,
      isFeatured: true,
      variants: [
        { size: 'XS', color: 'Floral', stock: 4, sku: 'DR-FLR-XS' },
        { size: 'S', color: 'Floral', stock: 7, sku: 'DR-FLR-S' },
        { size: 'M', color: 'Floral', stock: 5, sku: 'DR-FLR-M' },
      ],
    },
    {
      name: 'Casual Blouse',
      slug: 'casual-blouse',
      description: 'Elegant blouse perfect for work or casual outings.',
      price: 49.99,
      categoryId: categories[1].id,
      isPublished: true,
      variants: [
        { size: 'S', color: 'White', stock: 10, sku: 'BL-WHT-S' },
        { size: 'M', color: 'White', stock: 12, sku: 'BL-WHT-M' },
        { size: 'L', color: 'White', stock: 8, sku: 'BL-WHT-L' },
      ],
    },
    // Kids Products
    {
      name: 'Kids Graphic Tee',
      slug: 'kids-graphic-tee',
      description: 'Fun graphic t-shirt for kids. Soft and comfortable.',
      price: 19.99,
      categoryId: categories[2].id,
      isPublished: true,
      variants: [
        { size: '4-5Y', color: 'Blue', stock: 15, sku: 'KT-BLU-4' },
        { size: '6-7Y', color: 'Blue', stock: 12, sku: 'KT-BLU-6' },
        { size: '8-9Y', color: 'Blue', stock: 10, sku: 'KT-BLU-8' },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, ...product } = productData;
    
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        variants: {
          create: variants,
        },
      },
    });
  }

  console.log('Created sample products');

  // Create sample coupon
  await prisma.coupon.upsert({
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
  });

  console.log('Created sample coupon');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
