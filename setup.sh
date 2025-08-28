#!/bin/bash

echo "🚀 Setting up UFO Form with bKash Payment Integration"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✅ Please update .env.local with your actual credentials!"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🔄 Pushing database schema..."
npx prisma db push

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your PostgreSQL and bKash credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to test the application"
echo "4. Visit http://localhost:3000/admin to view the admin dashboard"
echo ""
echo "Useful commands:"
echo "- npm run db:studio  # Open Prisma Studio to view/edit data"
echo "- npm run db:reset   # Reset database (careful!)"
echo ""