#!/bin/bash

echo "🇮🇳 Setting up Kloset for Indian Market..."
echo ""
echo "✅ Converting to INR (Indian Rupees)"
echo "✅ Adding 3D Graphics Collection"
echo "✅ Removing Kids & Sale sections"
echo ""

# Run the India seed
echo "📦 Seeding database with INR prices..."
npx tsx prisma/seed-india.ts

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📊 What's been added:"
echo "   - 20 products with INR prices"
echo "   - 5 categories (Men, Women, Printed, Embroidery, Custom)"
echo "   - 3D graphics & modern designs"
echo "   - 100+ variants with stock"
echo ""
echo "💰 Price Range: ₹1,999 - ₹11,999"
echo ""
echo "🚀 Next steps:"
echo "   1. npm run dev"
echo "   2. Visit http://localhost:3001"
echo "   3. Browse the new collections!"
echo ""
echo "📖 Read INDIA_SETUP_GUIDE.md for complete details"
echo ""
