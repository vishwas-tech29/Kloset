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
    {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-tshirt',
      description: 'Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and style.',
      price: 49.99,
      comparePrice: 69.99,
      categoryId: categories[0].id,
      isPublished: true,
      isFeatured: true,
      variants: [
        { size: 'S', color: 'Black', stock: 10, sku: 'TS-BLK-S' },
        { size: 'M', color: 'Black', stock: 15, sku: 'TS-BLK-M' },
        { size: 'L', color: 'Black', stock: 8, sku: 'TS-BLK-L' },
        { size: 'S', color: 'White', stock: 12, sku: 'TS-WHT-S' },
        { size: 'M', color: 'White', stock: 20, sku: 'TS-WHT-M' },
      ],
    },
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
