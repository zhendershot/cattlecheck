#!/bin/bash

echo "🐄 CattleCheck Deployment Script"
echo "================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Login to Vercel
echo "Please login to Vercel..."
vercel login

# Create database
echo "Creating production database..."
vercel postgres create cattlecheck-db

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment started!"
echo ""
echo "Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables in Settings"
echo "3. Update Google OAuth redirect URIs"
echo "4. Run: npx prisma db push (with production DATABASE_URL)"
echo "5. Your app will be live at the URL shown above!"
echo ""
echo "Need help? Check the deployment guide in README.md"