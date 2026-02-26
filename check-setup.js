// Run this to check if everything is set up correctly
// Usage: node check-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Kloset E-commerce Setup...\n');

let hasErrors = false;

// Check 1: .env.local exists
console.log('1. Checking environment file...');
if (fs.existsSync('.env.local')) {
  console.log('   ✅ .env.local found');
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is missing`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ .env.local not found');
  console.log('   💡 Copy .env.local.example or create .env.local');
  hasErrors = true;
}

// Check 2: node_modules exists
console.log('\n2. Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules found');
} else {
  console.log('   ❌ node_modules not found');
  console.log('   💡 Run: npm install');
  hasErrors = true;
}

// Check 3: Prisma Client
console.log('\n3. Checking Prisma Client...');
if (fs.existsSync('node_modules/.prisma/client')) {
  console.log('   ✅ Prisma Client generated');
} else {
  console.log('   ❌ Prisma Client not generated');
  console.log('   💡 Run: npx prisma generate');
  hasErrors = true;
}

// Check 4: Database file (if using SQLite)
console.log('\n4. Checking database...');
if (fs.existsSync('prisma/dev.db')) {
  console.log('   ✅ SQLite database found');
} else {
  console.log('   ⚠️  Database not found');
  console.log('   💡 Run: npx prisma db push');
}

// Check 5: Next.js build
console.log('\n5. Checking Next.js...');
if (fs.existsSync('.next')) {
  console.log('   ✅ Next.js build cache found');
} else {
  console.log('   ℹ️  No build cache (this is normal for first run)');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup incomplete. Please fix the issues above.');
  console.log('\n📖 Quick fix:');
  console.log('   1. npm install');
  console.log('   2. npx prisma generate');
  console.log('   3. npx prisma db push');
  console.log('   4. npm run dev');
} else {
  console.log('✅ Setup looks good!');
  console.log('\n🚀 You can run: npm run dev');
}
console.log('='.repeat(50) + '\n');
