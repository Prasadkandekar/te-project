# StartupLaunch Backend API

A comprehensive REST API for the StartupLaunch platform built with Node.js, Express.js, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with email/password
- **Ideas Management**: CRUD operations for startup ideas with feedback system
- **Connections**: User matching and connection requests between entrepreneurs and mentors
- **Resources**: File upload and management for startup templates and documents
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Validation**: Zod
- **Security**: Helmet, bcrypt, CORS, rate limiting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or NeonDB account)
- Cloudinary account for file storage

### Installation

1. Clone the repository and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database URL (PostgreSQL/NeonDB)
- JWT secret
- Cloudinary credentials
- Email service credentials

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset

### Ideas
- `GET /api/ideas` - Get all ideas (with pagination and filters)
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get idea by ID
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/ideas/my-ideas` - Get user's own ideas

### Feedback
- `GET /api/ideas/:ideaId/feedback` - Get feedback for an idea
- `POST /api/ideas/:ideaId/feedback` - Create feedback
- `PUT /api/ideas/feedback/:id` - Update feedback
- `DELETE /api/ideas/feedback/:id` - Delete feedback

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections` - Send connection request
- `PUT /api/connections/:id` - Accept/reject connection
- `DELETE /api/connections/:id` - Delete connection
- `GET /api/connections/users` - Get users for connection

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Upload new resource
- `GET /api/resources/:id` - Get resource by ID
- `GET /api/resources/:id/download` - Download resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `GET /api/resources/my-resources` - Get user's resources

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles (entrepreneur, mentor, admin)
- **Idea**: Startup ideas with categories and stages
- **Feedback**: Feedback on ideas with ratings
- **Connection**: Connection requests between users
- **Resource**: Uploaded files and documents

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation with Zod
- CORS configuration
- Helmet for security headers
- File upload restrictions

## Deployment

The backend is designed to be deployed on platforms like:
- Render
- Railway
- AWS
- Heroku

Make sure to set up environment variables in your deployment platform.

## Development

### Running Tests
```bash
npm test
```

### Database Operations
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Code Structure

```
src/
├── config/          # Database and service configurations
├── controllers/     # Route handlers
├── middlewares/     # Custom middleware functions
├── routes/          # API route definitions
├── services/        # Business logic (optional)
├── utils/           # Utility functions
└── app.js          # Express app configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.