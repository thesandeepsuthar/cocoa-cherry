# Cocoa Cherry - Client System Setup Guide

This guide walks through setting up the Cocoa Cherry project on your client's system with all necessary external services and configurations.

## Prerequisites

Before starting, ensure your client has:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd cocoa-cherry
```

Replace `<your-github-repo-url>` with your actual GitHub repository URL.

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- Next.js 16.1.1
- React 19.2.3
- Mongoose (MongoDB driver)
- Cloudinary (image management)
- Tailwind CSS
- And other dependencies

---

## Step 3: Setup External Services

Your project uses 3 external services. Your client needs to create accounts and get credentials for each.

### 3A. MongoDB Setup

**What it is:** Database to store all your content (blog posts, menu items, events, reviews, etc.)

**Steps:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create a free account
3. Create a new project (name it "cocoa-cherry" or similar)
4. Create a cluster:
   - Choose "Free" tier
   - Select a region close to your client's location
   - Click "Create Cluster"
5. Wait for cluster to be created (5-10 minutes)
6. Click "Connect" button
7. Choose "Drivers" → "Node.js"
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)
9. Replace `<password>` with your database password
10. Note the database name (default is "admin", but you can use "cocoatest" or "quoteswipe")

**Important:** Keep this connection string secure - it contains your database password.

### 3B. Cloudinary Setup

**What it is:** Cloud service for storing and managing images (menu photos, gallery, etc.)

**Steps:**
1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up" and create a free account
3. After signup, you'll see your Dashboard
4. Look for "API Keys" or "Settings" section
5. You'll find:
   - **Cloud Name** (e.g., "dn67fklb6")
   - **API Key** (e.g., "197433426792523")
   - **API Secret** (e.g., "8YX5b0aemkXFzdM61TJh5_oheMc")
6. Copy these values - you'll need them in the next step

**Important:** Keep API Secret secure - never commit it to GitHub.

### 3C. GitHub Repository

**What it is:** Version control and code hosting

**Steps:**
1. Create a new repository on [GitHub](https://github.com/new)
2. Name it "cocoa-cherry" or similar
3. Make it Private (recommended for client projects)
4. Clone it to your client's system (Step 1 above)

---

## Step 4: Create Environment Files

Your project needs environment variables to connect to external services. Create two files in the project root:

### File 1: `.env.local`

This file contains sensitive credentials. **Never commit this to GitHub.**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=cocoa-cherry
MONGODB_DB=cocoatest
ADMIN_SECRET_KEY=cocoa-cherry-admin-2024
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Replace with actual values:**
- `MONGODB_URI` - From MongoDB Atlas (Step 3A, step 8)
- `MONGODB_DB` - Database name (e.g., "cocoatest")
- `ADMIN_SECRET_KEY` - Keep this secure, use a strong random string
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

### File 2: `.env` (Optional)

For non-sensitive configuration that can be committed:

```
NEXT_PUBLIC_APP_NAME=Cocoa Cherry
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5: Update .gitignore

Make sure `.gitignore` includes:

```
.env
.env.local
.env.*.local
node_modules/
.next/
```

This prevents accidentally committing sensitive credentials to GitHub.

---

## Step 6: Verify Setup

Run these commands to verify everything is working:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Cocoa Cherry website.

---

## Step 7: Database Initialization

The first time you run the app, MongoDB will automatically create collections when data is added. To seed initial data:

```bash
npm run seed:reviews
```

This populates the database with sample reviews.

---

## Step 8: Build for Production

When ready to deploy:

```bash
npm run build
npm start
```

This creates an optimized production build.

---

## Deployment Options

### Option A: Vercel (Recommended - Free tier available)

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `ADMIN_SECRET_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click "Deploy"

### Option B: Self-Hosted (VPS/Server)

1. SSH into your server
2. Install Node.js and npm
3. Clone repository
4. Create `.env.local` with credentials
5. Run `npm install && npm run build`
6. Use PM2 or similar to keep app running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "cocoa-cherry" -- start
   ```

### Option C: Docker (Advanced)

Create a `Dockerfile` for containerized deployment.

---

## Troubleshooting

### "Cannot find module 'mongoose'"
```bash
npm install
```

### "MONGODB_URI is not defined"
- Check `.env.local` exists in project root
- Verify all environment variables are set correctly
- Restart development server: `npm run dev`

### "Cloudinary API error"
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are correct
- Check Cloudinary account is active

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

---

## Project Structure

```
cocoa-cherry/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (backend)
│   │   ├── components/       # React components
│   │   ├── admin/            # Admin dashboard
│   │   ├── blog/             # Blog pages
│   │   ├── menu/             # Menu pages
│   │   └── ...
│   └── lib/
│       ├── models/           # MongoDB schemas
│       ├── mongodb.js        # Database connection
│       ├── cloudinary.js     # Image upload config
│       └── auth.js           # Authentication
├── public/                   # Static files
├── .env.local               # Environment variables (DO NOT COMMIT)
├── package.json             # Dependencies
└── next.config.mjs          # Next.js configuration
```

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local` to GitHub
- [ ] Use strong `ADMIN_SECRET_KEY`
- [ ] Keep MongoDB password secure
- [ ] Keep Cloudinary API Secret secure
- [ ] Use HTTPS in production
- [ ] Set MongoDB IP whitelist to allow only your server's IP

---

## Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Docs:** https://docs.mongodb.com/
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Mongoose Docs:** https://mongoosejs.com/

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Database
npm run seed:reviews     # Seed sample data
```

---

**Last Updated:** March 2026
**Project:** Cocoa Cherry
