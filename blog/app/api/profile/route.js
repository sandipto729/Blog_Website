import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongo';
import User from '@/model/user';
import connectDB from '@/lib/mongo'
import { driver } from '@/lib/neo4j'

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, location, website, profilePicture } = body;

    // Basic validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate website URL if provided
    if (website && website.trim()) {
      try {
        const url = new URL(website.startsWith('http') ? website : `https://${website}`);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch (error) {
        return NextResponse.json(
          { message: 'Please enter a valid website URL' },
          { status: 400 }
        );
      }
    }

    await connectDB();
    
    const updateData = {
      name: name.trim(),
      bio: bio?.trim() || '',
      location: location?.trim() || '',
      website: website?.trim() || '',
      updatedAt: new Date()
    };

    // Only update profile picture if provided
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-password'
      }
    );

    try{
        const neo4jSession = driver.session();
        await neo4jSession.run(
            `MATCH (u:User {id: $userId})
             SET u.name = $name,
                 u.profilePicture = $profilePicture
             RETURN u`,
            {
                userId: session.user.id,
                name: name.trim(),
                profilePicture: profilePicture || user.profilePicture || session.user.image || ''
            }
        );
        await neo4jSession.close();
    } catch (error) {
        console.error('Error updating user in Neo4j:', error);
        return NextResponse.json(
            { message: 'Failed to update user in Neo4j' },
            { status: 500 }
        );
    }

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        website: user.website,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
