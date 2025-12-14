# 🚀 Trackly - Project Management Platform

<div align="center">

**A modern project management solution built with Next.js 15**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748)](https://www.prisma.io/)

</div>

## 📋 About

Trackly is a full-featured project management platform that helps teams collaborate, organize tasks, and track project progress. Built as a group project for Fundamentals of Software Engineering.

## ✨ Features

- **Workspace & Project Management** - Create workspaces, organize projects with role-based access control
- **Kanban Board** - Drag-and-drop task management with multiple statuses
- **Task Management** - Assign tasks, set priorities, due dates, and attach files
- **Team Collaboration** - Real-time activity feeds, comments, and member management
- **Analytics Dashboard** - Visual insights with task distribution charts and progress tracking
- **Subscription System** - Three-tier plans (Free, Pro, Enterprise) with automated billing
- **Modern UI** - Responsive design with dark/light theme support

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI, Framer Motion  
**Backend:** Next.js API Routes, Prisma ORM, PostgreSQL  
**Services:** Kinde Auth, LemonSqueezy, UploadThing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trackly.git
   cd trackly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/trackly"
   KINDE_SITE_URL=http://localhost:3000
   KINDE_CLIENT_ID=your_kinde_client_id
   KINDE_CLIENT_SECRET=your_kinde_client_secret
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   LEMONSQUEEZY_API_KEY=your_api_key
   LEMONSQUEEZY_STORE_ID=your_store_id
   LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
trackly/
├── app/              # Next.js App Router
│   ├── (protected)/  # Protected routes
│   ├── actions/      # Server actions
│   ├── api/          # API routes
│   └── data/         # Data fetching
├── components/       # React components
├── lib/              # Utilities
├── prisma/           # Database schema
└── hooks/            # Custom hooks
```

## 💎 Subscription Plans

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Workspaces | 1 | 5 | Unlimited |
| Projects | 3 | 25 | Unlimited |
| Members | 5 | 50 | Unlimited |
| Tasks | 50 | 500 | Unlimited |
| Storage | 1GB | 10GB | 100GB |
| Analytics | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Group Members

[Add your group members' names and GitHub profiles here]

---

<div align="center">

**Built with ❤️ by the Trackly Team**

⭐ Star this repo if you find it helpful!

</div>
