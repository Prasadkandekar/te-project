# StartupLaunch Platform

A comprehensive platform for early-stage entrepreneurs to validate ideas, find co-founders and mentors, and access startup tools.

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router, TypeScript)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Custom Theme
- **UI Components**: Radix UI
- **API**: Axios
- **Auth**: JWT-based email authentication

### Backend
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: Cloudinary

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # Express.js API server
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

1. **Authentication System** - Secure JWT-based auth
2. **Idea Validation Hub** - Submit and get feedback on startup ideas
3. **Co-founder & Mentor Finder** - Connect with mentors and potential co-founders
4. **Startup Toolkit** - Access templates and resources

## Deployment

- **Frontend**: Vercel
- **Backend**: Render/AWS
- **Database**: NeonDB
- **Storage**: Cloudinary