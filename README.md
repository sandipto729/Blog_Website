# Blog Website

A modern full-stack blog platform built with Next.js, GraphQL, Neo4j, MongoDB, NextAuth.js, Socket.IO, and Azure Blob Storage. Features real-time commenting, authentication, profile management, post creation, category/tag filtering, **AI-powered similar post recommendations using GraphSAGE neural embeddings**, and legal compliance pages.

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

### 🤖 AI-Powered Recommendations
- **GraphSAGE Neural Embeddings** for intelligent post similarity
- **Neo4j Vector Index (HNSW)** for high-performance similarity search
- Multi-dimensional embedding support (128D GraphSAGE + 64D fallback)
- Real-time similar post suggestions based on content and engagement
- Intelligent fallback system with content-based recommendations
- Comprehensive embedding statistics and health monitoring

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
  - Neo4j (blog posts, comments, relationships, **Graph Data Science**)
  - MongoDB (user data, sessions)
- **AI/ML:** 
  - **GraphSAGE Neural Networks** for post embeddings
  - **Neo4j Vector Index (HNSW)** for similarity search
  - **TensorFlow.js** for neural network operations
- **Authentication:** NextAuth.js
- **Storage:** Azure Blob Storage
- **GraphQL:** Apollo Client/Server
- **Styling:** SCSS Modules, Responsive Design

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- **Neo4j Desktop v5.11+ or Neo4j AuraDB** (with Graph Data Science library)
- MongoDB Atlas or local MongoDB instance
- Azure Storage Account (for profile pictures)
- GitHub/Google OAuth apps (for social login)

### Neo4j Setup for AI Features
To enable GraphSAGE embeddings and vector similarity search:

1. **Install Neo4j Graph Data Science:**
   ```cypher
   # In Neo4j Browser, install GDS plugin
   CALL gds.version()
   ```

2. **Enable Vector Index support:**
   - Neo4j 5.11+ required for HNSW vector indexing
   - Ensure `dbms.security.procedures.unrestricted=gds.*` in neo4j.conf
   - Memory allocation: `dbms.memory.heap.initial_size=2G` (minimum recommended)

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
│   ├── SimilarPosts/             # AI-powered similar posts widget
│   ├── Footer/                   # Site footer
│   └── Header/                   # Navigation header
├── lib/                          # Utility libraries
│   ├── apolloClient.js          # GraphQL client setup
│   ├── mongo.js                 # MongoDB connection
│   ├── neo4j.js                 # Neo4j driver setup
│   ├── graphSage.js             # GraphSAGE AI embeddings system
│   ├── nsfwCheck.js             # Content moderation
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
   - **AI-Powered Discovery:** Get intelligent similar post recommendations

4. **AI Recommendations Experience:**
   - Similar posts appear automatically on blog detail pages
   - Recommendations improve over time with more content and engagement
   - Similarity scores help identify the most relevant suggestions
   - Real-time updates as new posts are published

### For Developers

#### AI System Configuration
```javascript
// GraphSAGE Configuration
const graphSageConfig = {
  embeddingDimension: 128,
  aggregator: 'mean',
  activationFunction: 'relu',
  sampleSizes: [25, 10],
  epochs: 10,
  learningRate: 0.01,
  batchSize: 256
};

// Vector Index Configuration
const vectorIndexConfig = {
  'vector.dimensions': 128,
  'vector.similarity_function': 'cosine',
  indexProvider: 'vector-2.0'
};
```

#### Using the AI System
```javascript
// Generate embeddings for a post
const embedding = await generatePostEmbedding(postId, forceRefresh);

// Find similar posts
const similarPosts = await findSimilarPosts(postId, limit);

// Get embedding statistics
const stats = await getEmbeddingStats();

// Batch process embeddings
const results = await batchGenerateEmbeddings(postIds);
```

#### Technical Features
- **Real-time Features:** The comment system uses Socket.IO for instant updates
- **Database Relationships:** Neo4j stores complex relationships between users, posts, comments
- **Authentication Flow:** NextAuth handles multiple providers with JWT sessions
- **File Uploads:** Azure Blob Storage integration for scalable image storage
- **AI Pipeline:** Automated embedding generation and similarity indexing
- **Performance Optimization:** Intelligent caching and batch processing

## API Endpoints

### REST API
- `POST /api/auth/signup` - User registration
- `POST /api/comment` - Create new comment
- `GET /api/profile` - Get user profile
- `POST /api/upload/image` - Upload profile picture

### GraphQL Endpoint
- `POST /api/graphql` - Main GraphQL endpoint for posts and comments

#### GraphQL AI Queries
```graphql
# Get embedding statistics
query {
  embeddingStats {
    totalPosts
    postsWithEmbedding
    coverage
    methods
    dimensions
  }
}

# Find similar posts
query {
  similarPosts(postId: "post-id", limit: 5) {
    postId
    title
    excerpt
    similarity
    likes
    comments
  }
}

# Generate embeddings
mutation {
  generateEmbedding(postId: "post-id", forceRefresh: true) {
    postId
    method
    dimensions
    cached
  }
}
```

### Socket.IO Events
- `comment` - Real-time comment posting
- `connection` - WebSocket connection management

## Key Features Explained

### 🤖 GraphSAGE AI Recommendation System

Our blog platform features a sophisticated AI-powered recommendation system using GraphSAGE (Graph Sample and Aggregate) neural networks for intelligent content discovery.

#### Architecture Overview
```
Blog Post → Feature Extraction → GraphSAGE Training → Vector Embeddings → HNSW Index → Similar Posts
```

#### GraphSAGE Implementation
- **Neural Network Approach:** Uses Graph Neural Networks to learn post representations
- **Multi-dimensional Features:** Analyzes 10+ post characteristics:
  - Content length and complexity
  - Engagement metrics (likes, comments)
  - Category and tag relationships
  - Author activity patterns
  - Recency and temporal factors
- **Graph Relationships:** Leverages Neo4j relationships for contextual learning
- **128-Dimensional Embeddings:** Rich vector representations for accurate similarity

#### Vector Index Optimization
- **Neo4j HNSW Index:** High-performance similarity search using Hierarchical Navigable Small World graphs
- **Multi-Dimensional Support:** Automatic index creation for different embedding dimensions
- **Cosine Similarity:** Optimized for content similarity measurements
- **Fallback Systems:** Comprehensive error handling with GDS cosine similarity and content-based recommendations

#### Intelligent Fallback Chain
1. **GraphSAGE + Vector Index:** Primary AI-powered recommendations
2. **GDS Cosine Similarity:** Graph Data Science backup method
3. **Content-Based Filtering:** Category and tag similarity
4. **Simple Feature Embeddings:** 64-dimensional backup system

#### Performance Features
- **Embedding Caching:** Intelligent caching prevents unnecessary recomputation
- **Batch Processing:** Efficient bulk embedding generation
- **Change Tracking:** Smart refresh based on content and engagement changes
- **Health Monitoring:** Comprehensive statistics and coverage metrics

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
- **Neo4j:** Blog posts, comments, categories, tags, relationships, and **AI embeddings**
- **Azure Blob Storage:** Profile pictures and media assets

#### Neo4j Graph Schema
```cypher
# Nodes
(:Post {id, title, content, embedding, embeddingDimensions, embeddingMethod})
(:User {id, name, email})
(:Category {name})
(:Tag {name})
(:Comment {id, content, createdAt})

# Relationships
(:User)-[:AUTHORED]->(:Post)
(:Post)-[:IN_CATEGORY]->(:Category)
(:Post)-[:TAGGED_WITH]->(:Tag)
(:User)-[:LIKED]->(:Post)
(:User)-[:COMMENTED_ON]->(:Post)
(:Comment)-[:REPLY_TO]->(:Comment)

# AI Indexes
CREATE VECTOR INDEX post_embedding_index_128d FOR (p:Post) ON (p.embedding)
CREATE VECTOR INDEX post_embedding_index_64d FOR (p:Post) ON (p.embedding)
```

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

### AI Features Troubleshooting
1. **GraphSAGE training fails:** 
   - Ensure Neo4j Graph Data Science plugin is installed
   - Check memory allocation (minimum 2GB heap size)
   - Verify node feature properties exist

2. **Vector index errors:**
   - Confirm Neo4j version 5.11+ for HNSW support
   - Check embedding dimensions match index configuration
   - Ensure sufficient posts exist for meaningful recommendations

3. **Slow similarity search:**
   - Monitor embedding generation logs
   - Check if vector indexes are being used
   - Consider batch processing for large datasets

4. **Missing similar posts:**
   - Verify GraphQL queries include all required fields
   - Check resolver error logs in browser console
   - Ensure embedding generation completed successfully

### Environment Setup
- Ensure all environment variables are set correctly
- Use `.env.local` for local development (not `.env`)
- Check database connections before running the application

## License
MIT License - feel free to use this project for learning and development.

## Recent Updates

### Version 2.0 - AI-Powered Recommendations (October 2024)
- ✅ **GraphSAGE Neural Embeddings** for intelligent post similarity
- ✅ **Neo4j Vector Index (HNSW)** implementation for high-performance search
- ✅ **Multi-dimensional embedding support** (128D + 64D fallback)
- ✅ **Comprehensive error handling** with intelligent fallback systems
- ✅ **Real-time similar posts widget** with beautiful gradient UI
- ✅ **Embedding health monitoring** and statistics dashboard
- ✅ **Batch processing capabilities** for large-scale embedding generation
- ✅ **Smart caching system** to prevent unnecessary recomputation

### Key Improvements
- **Performance:** Vector similarity search with sub-second response times
- **Accuracy:** Neural network-based recommendations vs. simple content matching
- **Scalability:** Efficient batch processing and intelligent caching
- **Reliability:** Multiple fallback systems ensure recommendations always work
- **Monitoring:** Comprehensive statistics and health metrics

### Technical Debt Resolved
- Fixed HTTP 431 errors in post editing due to long URL parameters
- Resolved Neo4j type coercion errors in vector similarity search
- Improved GraphQL resolver structure and error handling
- Enhanced embedding dimension compatibility across different methods

## Future Roadmap
- 🔄 **Content-based filtering** enhancements
- 🔄 **User preference learning** for personalized recommendations
- 🔄 **Semantic search** capabilities across all blog content
- 🔄 **Trending topics detection** using graph analytics
- 🔄 **Advanced NLP** integration for better content understanding

## Acknowledgments
- Next.js team for the amazing framework
- Neo4j for powerful graph database and GDS capabilities
- Socket.IO for real-time communication
- NextAuth.js for authentication simplicity
- TensorFlow.js for client-side ML capabilities
- GraphSAGE research team for the innovative neural network architecture