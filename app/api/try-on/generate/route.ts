import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userImageUrl, garmentImageUrl, category, productId, productName } = await req.json();

    if (!userImageUrl || !garmentImageUrl) {
      return NextResponse.json(
        { error: 'Missing required images' },
        { status: 400 }
      );
    }

    // Get session ID from header or generate new one
    const sessionId = req.headers.get('x-session-id') || `session_${Date.now()}`;

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      // Return mock result for demo purposes
      console.warn('REPLICATE_API_TOKEN not configured, returning mock result');
      
      // Save to database
      const result = await prisma.tryOnResult.create({
        data: {
          sessionId,
          productId,
          productName,
          userPhoto: userImageUrl,
          garmentImage: garmentImageUrl,
          resultImage: garmentImageUrl, // Use garment image as mock result
          category: category || 'clothing',
        },
      });

      return NextResponse.json({
        resultUrl: garmentImageUrl,
        message: 'Demo mode: Configure REPLICATE_API_TOKEN for real AI try-on',
        resultId: result.id,
      });
    }

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Run IDM-VTON model (best open-source virtual try-on)
    const output = await replicate.run(
      'yisol/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f',
      {
        input: {
          human_img: userImageUrl,
          garm_img: garmentImageUrl,
          garment_des: `A ${category} clothing item`,
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
        },
      }
    ) as any;

    const resultUrl = Array.isArray(output) ? output[0] : output;

    // Save result to database
    const result = await prisma.tryOnResult.create({
      data: {
        sessionId,
        productId,
        productName,
        userPhoto: userImageUrl,
        garmentImage: garmentImageUrl,
        resultImage: resultUrl,
        category: category || 'clothing',
      },
    });

    return NextResponse.json({
      resultUrl,
      resultId: result.id,
    });
  } catch (error: any) {
    console.error('Try-on generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate try-on' },
      { status: 500 }
    );
  }
}
