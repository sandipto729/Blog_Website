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
        await connectDB()
        const blog = await BlogModel.findById(id)
        return blog
    } catch (error) {
        console.error('Error fetching blog by ID:', error)
        throw new Error('Failed to fetch blog by ID')
    }
}

export async function fetchBlogsByAuthor(authorId) {
    try {
        await connectDB()
        const blogs = await BlogModel.find({ author: authorId }).sort({ createdAt: -1 })
        return blogs
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
                 RETURN p
                 ORDER BY p.createdAt DESC` :
                `MATCH (p:Post)-[:IN_CATEGORY]->(c:Category {name: $category})
                 RETURN p
                 ORDER BY p.createdAt DESC`,
                category === 'all' ? {} : { category }
            )
            return result.records.map(record => {
                const props = record.get('p').properties;
                if (props.createdAt && typeof props.createdAt === 'object') {
                    const dt = props.createdAt;
                    props.createdAt = `${dt.year.low}-${String(dt.month.low).padStart(2, '0')}-${String(dt.day.low).padStart(2, '0')}T${String(dt.hour.low).padStart(2, '0')}:${String(dt.minute.low).padStart(2, '0')}:${String(dt.second.low).padStart(2, '0')}.${dt.nanosecond.low}Z`;
                }
                return props;
            })
        } finally {
            neo4jSession.close()
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


// Default export with all functions
const DBOperation = {
    savePost,
    fetchAllBlogs,
    fetchBlogById,
    fetchBlogsByAuthor,
    fetchBlogsByCategory,
    fetchBlogsByTag,
    fetchUserById,
}

export default DBOperation