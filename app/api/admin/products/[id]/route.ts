import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      comparePrice,
      categoryId,
      isPublished,
      isFeatured,
      newImages,
    } = body;

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        categoryId,
        isPublished,
        isFeatured,
      },
    });

    // Add new images if provided
    if (newImages && newImages.length > 0) {
      // Get current max order
      const existingImages = await prisma.productImage.findMany({
        where: { productId: params.id },
        orderBy: { order: 'desc' },
        take: 1,
      });

      const startOrder = existingImages.length > 0 ? existingImages[0].order + 1 : 0;

      // Create new images
      await Promise.all(
        newImages.map((url: string, index: number) =>
          prisma.productImage.create({
            data: {
              productId: params.id,
              url,
              publicId: `product-${params.id}-${Date.now()}-${index}`,
              order: startOrder + index,
            },
          })
        )
      );
    }

    // Fetch updated product with images
    const updatedProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
