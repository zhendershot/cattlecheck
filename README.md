# 🐄 CattleCheck - The Ultimate Cattle Guard Rating Community

Welcome to CattleCheck! The most epic, tongue-in-cheek community platform for rating, reviewing, and discovering cattle guards across the land! 🎉

## What is CattleCheck? 🤔

CattleCheck is a fun, community-driven web application that allows users to:

- 🗺️ **Explore Interactive Maps** - Discover cattle guards on an interactive map
- ⭐ **Rate & Review** - Rate cattle guards on multiple criteria with playful language
- 📸 **Share Photos** - Upload and share photos of your favorite cattle guards
- 👥 **Community Management** - Wikipedia-style editing and community features
- 🏆 **Discover Excellence** - Find the highest-rated cattle guards in your area

## Features 🚀

### Rating System
Rate cattle guards on a 1-10 scale across multiple exciting criteria:
- **🧈 Smoothness Factor** - How buttery smooth is the crossing?
- **🌄 Scenic Splendor** - Is it cattle guard paradise?
- **🔧 Maintenance Magnificence** - Well-oiled machine or battle scars?
- **♿ Accessibility Awesomeness** - Can everyone experience the glory?
- **😎 Pure Coolness Quotient** - That special X-factor!

### Community Features
- **User Authentication** - Sign in with Google
- **Interactive Mapping** - Powered by Leaflet maps
- **Photo Uploads** - Share your cattle guard photography
- **Wikipedia-style Editing** - Community-driven content management
- **Rating History** - Track changes and improvements over time

## Tech Stack 💻

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **Maps**: React Leaflet
- **File Uploads**: UploadThing
- **Deployment**: Vercel

## Getting Started 🏁

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- UploadThing account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cattlecheck.git
   cd cattlecheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
   - `NEXTAUTH_SECRET` - Random secret for NextAuth
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `UPLOADTHING_SECRET` - UploadThing secret key
   - `UPLOADTHING_APP_ID` - UploadThing app ID

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel 🚀

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy!

3. **Set up your database**
   - Use Vercel Postgres or any PostgreSQL provider
   - Run `npx prisma db push` to set up tables

## Database Schema 📊

The app uses a PostgreSQL database with the following main models:
- **Users** - Authentication and user profiles
- **CattleGuards** - The star of the show!
- **Ratings** - Community ratings with detailed criteria
- **Images** - Photo uploads for cattle guards
- **Edits** - Wikipedia-style edit history

## Contributing 🤝

We welcome contributions from fellow cattle guard enthusiasts! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- To all the cattle guards keeping our roads safe and cattle contained
- The amazing open-source community
- Every contributor who helps make this the most epic cattle guard platform ever!

## Support 💬

Having trouble? Check out our documentation or open an issue on GitHub.

---

**Remember**: No cattle were harmed in the making of this app! 🐄❤️

Made with ❤️ by the CattleCheck community
