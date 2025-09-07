# Blog Website

A modern full-stack blog platform built with Next.js, GraphQL, Neo4j, MongoDB, NextAuth.js, Socket.IO, and Azure Blob Storage. Features real-time commenting, authentication, profile management, post creation, category/tag filtering, and legal compliance pages.

## Features

### 🔐 Authentication & User Management
- NextAuth.js with multiple providers (GitHub, Google, Credentials)
- User registration and login system
- Profile management with bio, location, website fields
- Profile picture uploads via Azure Blob Storage
- Session management and refresh functionality

### 📝 Blog Management
- Rich text blog post creation and editing
- Post categorization and tagging system
- Dynamic slug generation from titles
- Post excerpt auto-generation
- Author attribution and post management
- Delete and edit capabilities for post authors

### 💬 Real-time Comment System
- **Socket.IO powered real-time comments**
- Instant comment posting without page refresh
- Nested reply system (comments and replies)
- Real-time updates across all connected clients
- User profile integration in comments
- Comment storage in Neo4j graph database

### 🔍 Content Discovery
- Category-based filtering
- Tag-based filtering
- Blog post search functionality
- Author-specific post listings
- Dashboard with user's post management

### 👤 User Dashboard
- Personal post management
- Profile editing and updates
- Post creation interface
- User statistics and activity

### 📱 UI/UX Features
- Responsive design with SCSS modules
- Dark/Light theme support
- Modern component architecture
- Loading states and error handling
- Professional styling and animations

### ⚖️ Legal Compliance
- Privacy Policy page
- Terms & Conditions page
- Cookie Policy page
- GDPR compliant user data handling

## Tech Stack
- **Frontend:** Next.js 14, React 18, SCSS Modules
- **Backend:** Next.js API Routes, Custom Node.js Server
- **Real-time:** Socket.IO for WebSocket connections
- **Database:** 
  - Neo4j (blog posts, comments, relationships)
  - MongoDB (user data, sessions)
- **Authentication:** NextAuth.js
- **Storage:** Azure Blob Storage
- **GraphQL:** Apollo Client/Server
- **Styling:** SCSS Modules, Responsive Design

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- Neo4j Desktop or Neo4j AuraDB
- MongoDB Atlas or local MongoDB instance
- Azure Storage Account (for profile pictures)
- GitHub/Google OAuth apps (for social login)

### Environment Variables
Create a `.env.local` file in the `blog/` directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-neo4j-password

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_STORAGE_CONTAINER_NAME=profile-pictures
```

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandipto729/Blog_Website.git
   cd Blog_Website/blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up databases:**
   - Start Neo4j Desktop and create a new database
   - Ensure MongoDB is running (locally or Atlas)
   - Update connection strings in `.env.local`

4. **Configure OAuth providers:**
   - Create GitHub OAuth app in GitHub Developer Settings
   - Create Google OAuth credentials in Google Cloud Console
   - Add callback URLs: `http://localhost:3000/api/auth/callback/[provider]`

5. **Set up Azure Storage (optional):**
   - Create an Azure Storage account
   - Create a blob container for profile pictures
   - Add connection string to environment variables

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Real-time features work via WebSocket on the same port

## Project Structure

```
blog/
├── app/                          # Next.js App Router
│   ├── (Authentication)/         # Auth pages (login, signup)
│   ├── (Home)/                   # Blog listing and detail pages
│   ├── (policy)/                 # Legal pages
│   ├── (profile)/                # User dashboard and post management
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── comment/              # Comment API endpoints
│   │   ├── DBOperation/          # Database operations
│   │   ├── graphQL/              # GraphQL endpoint
│   │   ├── profile/              # Profile management API
│   │   └── upload/               # File upload endpoints
│   └── socket-check/             # Socket.IO testing page
├── component/                    # Reusable React components
│   ├── Comments/                 # Real-time comment system
│   ├── CreatePost/               # Blog post creation
│   ├── Footer/                   # Site footer
│   └── Header/                   # Navigation header
├── lib/                          # Utility libraries
│   ├── apolloClient.js          # GraphQL client setup
│   ├── mongo.js                 # MongoDB connection
│   ├── neo4j.js                 # Neo4j driver setup
│   └── sessionUtils.js          # Session management
├── model/                        # Database models
│   ├── post.js                  # Blog post model
│   └── user.js                  # User model
├── public/                       # Static assets
├── server.js                     # Custom server with Socket.IO
└── socket.js                     # Socket.IO client setup
```

## Usage Guide

### For Users
1. **Authentication:**
   - Sign up with email/password or use GitHub/Google OAuth
   - Complete your profile with bio, location, and website
   - Upload a profile picture via Azure Blob Storage

2. **Creating Content:**
   - Navigate to "Create Post" in your dashboard
   - Write blog posts with rich text formatting
   - Add categories and tags for better discoverability
   - Posts are automatically assigned slugs and excerpts

3. **Interacting with Content:**
   - Browse posts by category or tag filters
   - View detailed blog posts with author information
   - Leave real-time comments that appear instantly
   - Reply to other users' comments for discussions

4. **Managing Your Content:**
   - Access your dashboard to view all your posts
   - Edit or delete your existing blog posts
   - Monitor engagement through comments

### For Developers
- **Real-time Features:** The comment system uses Socket.IO for instant updates
- **Database Relationships:** Neo4j stores complex relationships between users, posts, comments
- **Authentication Flow:** NextAuth handles multiple providers with JWT sessions
- **File Uploads:** Azure Blob Storage integration for scalable image storage

## API Endpoints

### REST API
- `POST /api/auth/signup` - User registration
- `POST /api/comment` - Create new comment
- `GET /api/profile` - Get user profile
- `POST /api/upload/image` - Upload profile picture

### GraphQL Endpoint
- `POST /api/graphql` - Main GraphQL endpoint for posts and comments

### Socket.IO Events
- `comment` - Real-time comment posting
- `connection` - WebSocket connection management

## Key Features Explained

### Real-time Comment System
The comment system is built with Socket.IO for instant communication:
- Comments appear immediately without page refresh
- User information (name, profile picture) is included in real-time
- Supports nested replies with proper threading
- Stores all data in Neo4j for complex relationship queries

### Authentication Architecture
- NextAuth.js with multiple providers (GitHub, Google, Credentials)
- JWT-based sessions with automatic refresh
- User data stored in MongoDB with profile management
- Integration with Neo4j for content relationship mapping

### Database Design
- **MongoDB:** User profiles, authentication, session management
- **Neo4j:** Blog posts, comments, categories, tags, and all relationships
- **Azure Blob Storage:** Profile pictures and media assets

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and component structure
- Test real-time features with multiple browser windows
- Ensure database connections are properly closed
- Update README for any new features or API changes

## Troubleshooting

### Common Issues
1. **Socket.IO not connecting:** Check if port 3000 is available and server.js is running
2. **Neo4j connection errors:** Ensure Neo4j is running and credentials are correct
3. **Authentication issues:** Verify OAuth app configurations and callback URLs
4. **Image upload failing:** Check Azure Blob Storage connection string and container permissions

### Environment Setup
- Ensure all environment variables are set correctly
- Use `.env.local` for local development (not `.env`)
- Check database connections before running the application

## License
MIT License - feel free to use this project for learning and development.

## Acknowledgments
- Next.js team for the amazing framework
- Neo4j for powerful graph database capabilities
- Socket.IO for real-time communication
- NextAuth.js for authentication simplicity