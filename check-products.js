const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      take: 5,
    });

    console.log(`\n✅ Found ${products.length} products in database:\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category.name}`);
      console.log(`   Price: ₹${product.price.toLocaleString('en-IN')}`);
      console.log(`   Images: ${product.images.length}`);
      console.log('');
    });

    const totalProducts = await prisma.product.count();
    console.log(`📊 Total products in database: ${totalProducts}\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
