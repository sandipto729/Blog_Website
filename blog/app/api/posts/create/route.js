import { NextResponse } from 'next/server'
import { savePost } from '../DBOperation/Post/Blog.js'

export async function POST(request) {
  try {
    const { title, content, tags, category } = await request.json()
    
    const newPost = await savePost(title, content, tags, category)
    
    return NextResponse.json(
      { 
        message: 'Post created successfully',
        post: {
          id: newPost._id,
          title: newPost.title,
          slug: newPost.slug,
          author: newPost.author,
          createdAt: newPost.createdAt
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
