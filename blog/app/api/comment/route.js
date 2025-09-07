import { NextResponse } from 'next/server';
import { SaveComment } from '../DBOperation/PostComment/comment';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const body = await req.json();
    const { postID, parentID, userID, content } = body;

    if (!postID || !userID || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    // }

    const result = await SaveComment(postID, parentID, userID, content);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json({ success: false, message: 'Failed to save comment' }, { status: 500 });
  }
}
