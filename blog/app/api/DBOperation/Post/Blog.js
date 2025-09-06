import BlogModel from '@/model/post'
import connectDB from '@/lib/mongo'
import UserModel from '@/model/user'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { driver } from '@/lib/neo4j'

export async function savePost(title, content, tags, category) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error('Authentication required')
        }

        // Validate required fields
        if (!title || !content) {
            throw new Error('Title and content are required')
        }

        // Validate HTML content (basic sanitization)
        if (content.length > 50000) {
            throw new Error('Content is too long')
        }

        // Generate excerpt from content (first 150 characters)
        const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        
        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        const neo4jSession = driver.session()
        try {
            const result = await neo4jSession.run(
                `MERGE (u:User {id: $userId})
                ON CREATE SET u.name = $userName, 
                              u.profilePicture = $userProfilePicture
                MERGE (c:Category {name: $category})
                CREATE (p:Post {
                    id: randomUUID(),
                    title: $title,
                    content: $content,
                    excerpt: $excerpt,
                    slug: $slug,
                    createdAt: datetime()
                })
                MERGE (u)-[:AUTHORED]->(p)
                MERGE (p)-[:IN_CATEGORY]->(c)
                WITH p
                UNWIND $tags AS tagName
                    MERGE (t:Tag {name: tagName})
                    MERGE (p)-[:TAGGED_WITH]->(t)
                RETURN p`,
                {
                    userId: session.user.id,
                    userName: session.user.name,
                    userProfilePicture: session.user.profilePicture || session.user.image || '',
                    category: category || 'general',
                    title,
                    content,
                    excerpt,
                    slug,
                    tags: tags || []
                }
            )
            
            if (result.records.length === 0) {
                throw new Error('Failed to create post')
            }
            
            const createdPost = result.records[0].get('p').properties
            return {
                success: true,
                post: createdPost
            }
            
        } finally {
            neo4jSession.close()
        }
    } catch (error) {
        console.error('Error saving post:', error)
        throw new Error(error.message || 'Failed to save post')
    }
}


export async function fetchAllBlogs() {
    try {
        await connectDB()
        const blogs = await BlogModel.find().sort({ createdAt: -1 })
        return blogs
    } catch (error) {
        console.error('Error fetching blogs:', error)
        throw new Error('Failed to fetch blogs')
    }
}

export async function fetchBlogById(id) {
    try {
        const neo4jSession = driver.session()
        try {
            const result = await neo4jSession.run(
                `MATCH (p:Post {id: $id}) 
                MATCH (u:User)-[:AUTHORED]->(p)
                MATCH (p)-[:IN_CATEGORY]->(c:Category)
                OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
                WITH p, u, c, collect(t.name) AS tags
                SET p.authorId = u.id,
                    p.authorName = u.name,
                    p.authorProfilePicture = u.profilePicture,
                    p.category = c.name,
                    p.tags = tags
                 RETURN p`,
                { id }
            )
            if (result.records.length === 0) {
                throw new Error('Blog not found')
            }
            const props = result.records[0].get('p').properties;
            // Handle datetime conversion in the database layer
            if (props.createdAt && typeof props.createdAt === 'object') {
                const dt = props.createdAt;
                const year = dt.year?.low || dt.year || 0;
                const month = dt.month?.low || dt.month || 1;
                const day = dt.day?.low || dt.day || 1;
                const hour = dt.hour?.low || dt.hour || 0;
                const minute = dt.minute?.low || dt.minute || 0;
                const second = dt.second?.low || dt.second || 0;
                const nanosecond = dt.nanosecond?.low || dt.nanosecond || 0;
                
                const milliseconds = Math.floor(nanosecond / 1000000);
                const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
                props.createdAt = date.toISOString();
            }
            return props;
        } finally {
            await neo4jSession.close()
        }
    } catch (error) {
        console.error('Error fetching blog by ID:', error)
        if (error.code === 'SessionExpired' || error.code === 'ServiceUnavailable') {
            throw new Error('Database connection lost. Please try again.')
        }
        throw new Error('Failed to fetch blog by ID')
    }
}

export async function fetchBlogsByAuthor(authorId) {
    try {
        const neo4jSession = driver.session()
        try {
            const result = await neo4jSession.run(
                `MATCH (u:User {id: $authorId})-[:AUTHORED]->(p:Post)
                 MATCH (p)-[:IN_CATEGORY]->(c:Category)
                 OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
                 WITH p, c, collect(t.name) AS tags
                 SET p.category = c.name,
                     p.tags = tags
                 RETURN p
                 ORDER BY p.createdAt DESC`,
                { authorId }
            )
            return result.records.map(record => {
                const props = record.get('p').properties;
                // Handle datetime conversion in the database layer
                if (props.createdAt && typeof props.createdAt === 'object') {
                    const dt = props.createdAt;
                    const year = dt.year?.low || dt.year || 0;
                    const month = dt.month?.low || dt.month || 1;
                    const day = dt.day?.low || dt.day || 1;
                    const hour = dt.hour?.low || dt.hour || 0;
                    const minute = dt.minute?.low || dt.minute || 0;
                    const second = dt.second?.low || dt.second || 0;
                    const nanosecond = dt.nanosecond?.low || dt.nanosecond || 0;
                    
                    const milliseconds = Math.floor(nanosecond / 1000000);
                    const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
                    props.createdAt = date.toISOString();
                }
                return props;
            })
        } finally {
            await neo4jSession.close()
        }
    } catch (error) {
        console.error('Error fetching blogs by author:', error)
        throw new Error('Failed to fetch blogs by author')
    }
}

export async function fetchBlogsByCategory(category) {
    try {
        const neo4jSession = driver.session()
        try {
            let result = await neo4jSession.run(
                category === 'all' ?
                `MATCH (p:Post)-[:IN_CATEGORY]->(c:Category)
                 OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
                 WITH p, c, collect(t.name) AS tags
                 SET p.category = c.name,
                     p.tags = tags
                 RETURN p
                 ORDER BY p.createdAt DESC` :
                `MATCH (p:Post)-[:IN_CATEGORY]->(c:Category {name: $category})
                 OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
                 WITH p, c, collect(t.name) AS tags
                 SET p.category = c.name,
                     p.tags = tags
                 RETURN p
                 ORDER BY p.createdAt DESC`,
                category === 'all' ? {} : { category }
            )
            return result.records.map(record => {
                const props = record.get('p').properties;
                // Handle datetime conversion in the database layer
                if (props.createdAt && typeof props.createdAt === 'object') {
                    const dt = props.createdAt;
                    const year = dt.year?.low || dt.year || 0;
                    const month = dt.month?.low || dt.month || 1;
                    const day = dt.day?.low || dt.day || 1;
                    const hour = dt.hour?.low || dt.hour || 0;
                    const minute = dt.minute?.low || dt.minute || 0;
                    const second = dt.second?.low || dt.second || 0;
                    const nanosecond = dt.nanosecond?.low || dt.nanosecond || 0;
                    
                    const milliseconds = Math.floor(nanosecond / 1000000);
                    const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
                    props.createdAt = date.toISOString();
                }
                return props;
            })
        } finally {
            await neo4jSession.close()
        }
    } catch (error) {
        console.error('Error fetching blogs by category:', error)
        throw new Error('Failed to fetch blogs by category')
    }
}
export async function fetchBlogsByTag(tag) {
    try {
        await connectDB()
        const blogs = await BlogModel.find({ tags: tag }).sort({ createdAt: -1 })
        return blogs
    } catch (error) {
        console.error('Error fetching blogs by tag:', error)
        throw new Error('Failed to fetch blogs by tag')
    }
}

export async function fetchUserById(blogID) {
    try {
        const neo4jSession = driver.session()
        try {
            const result = await neo4jSession.run(
                `MATCH (u:User)-[:AUTHORED]->(p:Post {id: $blogID})
                 RETURN u.id AS id, u.name AS name, u.profilePicture AS profilePicture`,
                { blogID }
            )
            if (result.records.length === 0) {
                throw new Error('User not found for the given blog ID')
            }
            const record = result.records[0]
            return {
                id: record.get('id'),
                name: record.get('name'),
                // email: record.get('email'),
                profilePicture: record.get('profilePicture')
            }
        } finally {
            neo4jSession.close()
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error)
        throw new Error('Failed to fetch user by ID')
    }
}


export async function EditBlog(postId, title, content, tags, category) {
    try{
        // Generate excerpt from content (first 150 characters)
        const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        
        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        const neo4jSession = driver.session()
        try {
            const result = await neo4jSession.run(
                `MATCH (p:Post {id: $postId})
                SET p.title = $title,
                    p.content = $content,
                    p.excerpt = $excerpt,
                    p.slug = $slug,
                    p.updatedAt = datetime()
                WITH p
                OPTIONAL MATCH (p)-[r:TAGGED_WITH]->(t:Tag)
                DELETE r
                WITH p
                UNWIND $tags AS tagName
                    MERGE (t:Tag {name: tagName})
                    MERGE (p)-[:TAGGED_WITH]->(t)
                WITH p
                OPTIONAL MATCH (p)-[catRel:IN_CATEGORY]->(oldCat:Category)
                DELETE catRel
                WITH p
                MERGE (c:Category {name: $category})
                MERGE (p)-[:IN_CATEGORY]->(c)
                RETURN p`,
                {
                    postId,
                    title,
                    content,
                    excerpt,
                    slug,
                    tags: tags || [],
                    category: category || 'general'
                }
            )
            if (result.records.length === 0) {
                throw new Error('Post not found or update failed')
            }
            return result.records[0].get('p').properties
        } finally {
            neo4jSession.close()
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error)
        throw new Error('Failed to fetch user by ID')
    }
}

export async function deleteBlog(postId) {
    try {
        const neo4jSession = driver.session()
        try {
            await neo4jSession.run(
                `MATCH (p:Post {id: $postId})
                 DETACH DELETE p`,
                { postId }
            )
            return { success: true }
        } finally {
            neo4jSession.close()
        }
    } catch (error) {
        console.error('Error deleting blog:', error)
        throw new Error('Failed to delete blog')
    }
}

// Default export with all functions
const DBOperation = {
    savePost,
    fetchAllBlogs,
    fetchBlogById,
    fetchBlogsByAuthor,
    fetchBlogsByCategory,
    fetchBlogsByTag,
    fetchUserById,
    EditBlog,
    deleteBlog
}

export default DBOperation