import { v4 as uuidv4 } from "uuid"; 
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { driver } from '@/lib/neo4j'
import { Server } from 'socket.io';


export async function SaveComment(postID, parentID, userID, content, io) {
    const neo4jSession = driver.session();
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Authentication required");
    }
    try {
        const commentID = uuidv4();
        const createdAt = new Date().toISOString();

        // Ensure User exists
        await neo4jSession.run(
            `MERGE (u:User {id: $userId})
             ON CREATE SET u.name = $userName, 
                           u.profilePicture = $userProfilePicture`,
            {
                userId: session.user.id,
                userName: session.user.name,
                userProfilePicture: session.user.profilePicture || session.user.image || ''
            }
        );

        // Ensure Post exists
        await neo4jSession.run(
            `MERGE (p:Post {id: $postId})`,
            { postId: postID }
        );

        // Create Comment node + link to User
        await neo4jSession.run(
            `CREATE (c:Comment {id: $commentId, content: $content, createdAt: $createdAt})
             WITH c
             MATCH (u:User {id: $userId})
             MERGE (u)-[:WROTE]->(c)`,
            { commentId: commentID, content, createdAt, userId: userID }
        );

        // Link Comment to Post or Parent Comment
        if (parentID) {
            await neo4jSession.run(
                `MATCH (c:Comment {id: $commentId}), (parent:Comment {id: $parentId})
                 MERGE (c)-[:REPLY_TO]->(parent)`,
                { commentId: commentID, parentId: parentID }
            );
        } else {
            await neo4jSession.run(
                `MATCH (c:Comment {id: $commentId}), (p:Post {id: $postId})
                 MERGE (c)-[:COMMENTED_ON]->(p)`,
                { commentId: commentID, postId: postID }
            );
        }

        // Emit the `commentAdded` event
        if (io) {
            console.log('Emitting commentAdded event:', {
                id: commentID,
                content,
                createdAt,
                userId: userID,
                parentId: parentID || null,
                postId: postID
            });
            io.emit('commentAdded', {
                id: commentID,
                content,
                createdAt,
                userId: userID,
                parentId: parentID || null,
                postId: postID
            });
        }

        return {
            success: true,
            comment: {
                id: commentID,
                content,
                createdAt,
                userId: userID,
                parentId: parentID || null,
                postId: postID
            }
        };
    } catch (error) {
        console.error("Error saving comment:", error);
        throw new Error("Failed to save comment");
    } finally {
        neo4jSession.close();
    }
}


// fetch comments for a post
export async function FetchComments(postID) {
    const neo4jSession = driver.session();

    try {
        // First, get all top-level comments (not replies)
        const result = await neo4jSession.run(
            `MATCH (p:Post {id: $postId})<-[:COMMENTED_ON]-(c:Comment)
             MATCH (c)<-[:WROTE]-(u:User)
             RETURN c, u
             ORDER BY c.createdAt ASC`,
            { postId: postID }
        );

        const comments = [];
        
        for (const record of result.records) {
            const commentNode = record.get('c').properties;
            const userNode = record.get('u').properties;

            // Now get all replies for this comment with their user info
            const repliesResult = await neo4jSession.run(
                `MATCH (c:Comment {id: $commentId})<-[:REPLY_TO]-(reply:Comment)
                 MATCH (reply)<-[:WROTE]-(replyUser:User)
                 RETURN reply, replyUser
                 ORDER BY reply.createdAt ASC`,
                { commentId: commentNode.id }
            );

            const replies = repliesResult.records.map(replyRecord => {
                const replyNode = replyRecord.get('reply').properties;
                const replyUserNode = replyRecord.get('replyUser').properties;
                
                return {
                    id: replyNode.id,
                    content: replyNode.content,
                    createdAt: replyNode.createdAt,
                    user: {
                        id: replyUserNode.id,
                        name: replyUserNode.name,
                        profilePicture: replyUserNode.profilePicture || ''
                    }
                };
            });

            comments.push({
                id: commentNode.id,
                content: commentNode.content,
                createdAt: commentNode.createdAt,
                user: {
                    id: userNode.id,
                    name: userNode.name,
                    profilePicture: userNode.profilePicture || ''
                },
                replies: replies
            });
        }

        return { success: true, comments };
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
    } finally {
        neo4jSession.close();
    }
}