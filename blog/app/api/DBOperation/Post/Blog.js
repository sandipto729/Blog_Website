import BlogModel from '@/model/post'
import connectDB from '@/lib/mongo'
import UserModel from '@/model/user'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function savePost(title, content, tags, category) {
    try {
        // Check if user is authenticated
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

        await connectDB()

        // Create post object
        const postData = {
            title: title.trim(),
            content: content,
            tags: tags || [],
            category: category || 'general',
            author: session.user.id,
            published: true,
            views: 0,
            likes: [],
            comments: []
        }
        const newPost = await BlogModel.create(postData)

        // Update user's posts array
        const authorUser = await UserModel.findById(postData.author)
        if (authorUser) {
            authorUser.posts.push(newPost._id)
            await authorUser.save()
        }


        console.log('Post created successfully:', newPost._id)
        return newPost

    } catch (error) {
        console.error('Error saving post:', error)
        throw new Error('Failed to save post')
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
        await connectDB()
        if(category === 'all') {
            const blogs = await BlogModel.find().sort({ createdAt: -1 })
            return blogs
        }
        //  --- IGNORE ---
        const blogs = await BlogModel.find({ category }).sort({ createdAt: -1 })
        return blogs
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

export async function fetchUserById(userId) {
    try {
        await connectDB()
        const user = await UserModel.findById(userId).select('name email profilePicture')
        return user
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