import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import DBOperation from "../DBOperation/Post/Blog.js";
import CommentDBOperation from "../DBOperation/PostComment/comment.js";

// Helper function to convert Neo4j datetime to ISO string
const convertNeo4jDateTime = (dateTime) => {
    if (!dateTime || typeof dateTime !== 'object') {
        return dateTime;
    }
    
    try {
        const { year, month, day, hour, minute, second, nanosecond } = dateTime;
        const yearVal = year?.low || year || 0;
        const monthVal = month?.low || month || 1;
        const dayVal = day?.low || day || 1;
        const hourVal = hour?.low || hour || 0;
        const minuteVal = minute?.low || minute || 0;
        const secondVal = second?.low || second || 0;
        const nanosecondVal = nanosecond?.low || nanosecond || 0;
        
        const milliseconds = Math.floor(nanosecondVal / 1000000);
        const date = new Date(yearVal, monthVal - 1, dayVal, hourVal, minuteVal, secondVal, milliseconds);
        return date.toISOString();
    } catch (error) {
        console.error('Error converting Neo4j datetime:', error);
        return new Date().toISOString(); // fallback to current time
    }
};

// Helper function to process post data and convert datetime fields
const processPostData = (post) => {
    if (!post) return post;
    
    const processedPost = { ...post };
    
    // Convert datetime fields
    if (processedPost.createdAt) {
        processedPost.createdAt = convertNeo4jDateTime(processedPost.createdAt);
    }
    
    if (processedPost.updatedAt) {
        processedPost.updatedAt = convertNeo4jDateTime(processedPost.updatedAt);
    }
    
    return processedPost;
};

const typeDefs = `#graphql
    # User Schema
    type User {
        id: ID!
        name: String!
        email: String
        profilePicture: String
    }
    # Post Schema
    type Post {
        id: ID!
        title: String!
        content: String!
        excerpt: String
        tags: [String]
        category: String
        author: User
        slug: String!
        published: Boolean
        featured: Boolean
        views: Int
        likes: Int
        readTime: Int
        seoTitle: String
        seoDescription: String
        createdAt: String
        updatedAt: String
    }

    #comment Save Schema
    type CommentSave {
        id: ID!
        content: String!
        createdAt: String
        userId: ID!
        parentId: ID
        postId: ID!
    }

    #comment Fetch Schema
    type Comment {
        id: ID!
        content: String!
        createdAt: String
        user: User
        replies: [Comment]
    }

    # Input types for mutations
    input CreatePostInput {
        title: String!
        content: String!
        tags: [String]
        category: String
        seoTitle: String
        seoDescription: String
    }


    # Response types
    type PostResponse {
        success: Boolean!
        message: String!
        post: Post
    }
    
    type CommentResponse {
        success: Boolean!
        message: String!
        comment: CommentSave
    }

    type Query {
        posts: [Post!]!
        post(id: ID!): Post
        postsByAuthor(authorId: ID!): [Post!]!
        postsByCategory(category: String!): [Post!]!
        postsByTag(tag: String!): [Post!]!
        fetchLikes(postId: ID!): [User!]!
        fetchComments(postId: ID!): [Comment!]!
    }

    type Mutation {
        createPost(input: CreatePostInput!): PostResponse!
        updatePost(id: ID!, input: CreatePostInput!): PostResponse!
        deletePost(id: ID!): PostResponse!
        PostLikeToggle(postId: ID!, userId: ID!): PostResponse!
        SaveComment(postID: ID!, parentID: ID, userID: ID!, content: String!): CommentResponse!
    }
`;

const resolvers = {
    Post: {
        author: async (post) => {
            try {
                const author = await DBOperation.fetchUserById(post.id);
                if (!author) return null;
                return {
                    ...author,
                    id: author.id || author._id?.toString() || null
                };
            } catch (error) {
                console.error('Error fetching author:', error);
                throw new Error('Failed to fetch author');
            }
        }
    },
    Query: {
        posts: async () => {
            try {
                const posts = await DBOperation.fetchAllBlogs();
                return posts.map(post => ({
                    ...post.toObject(),
                    id: post._id.toString()
                }));
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw new Error('Failed to fetch posts');
            }
        },

        post: async (_, { id }) => {
            try {
                const post = await DBOperation.fetchBlogById(id);
                if (!post) {
                    throw new Error('Post not found');
                }
                return processPostData({
                    ...post,
                    id: post.id
                });
            } catch (error) {
                console.error('Error fetching post:', error);
                throw new Error('Failed to fetch post');
            }
        },

        postsByAuthor: async (_, { authorId }) => {
            try {
                const posts = await DBOperation.fetchBlogsByAuthor(authorId);
                return posts.map(post => processPostData({
                    ...post,
                    id: post.id
                }));
            } catch (error) {
                console.error('Error fetching posts by author:', error);
                throw new Error('Failed to fetch posts by author');
            }
        },

        postsByCategory: async (_, { category }) => {
            try {
                const posts = await DBOperation.fetchBlogsByCategory(category);
                return posts.map(post => processPostData({
                    ...post,
                    id: post.id // Neo4j uses 'id' property
                }));
            } catch (error) {
                console.error('Error fetching posts by category:', error);
                throw new Error('Failed to fetch posts by category');
            }
        },

        postsByTag: async (_, { tag }) => {
            try {
                const posts = await DBOperation.fetchBlogsByTag(tag);
                return posts.map(post => ({
                    ...post.toObject(),
                    id: post._id.toString()
                }));
            } catch (error) {
                console.error('Error fetching posts by tag:', error);
                throw new Error('Failed to fetch posts by tag');
            }
        },

        fetchLikes: async (_, { postId }) => {
            try {
                const users = await DBOperation.fetchUsersWhoLikedPost(postId);
                return users.map(user => ({
                    ...user,
                    id: user.id || user._id?.toString() || null
                }));
            } catch (error) {
                console.error('Error fetching likes for post:', error);
                throw new Error('Failed to fetch likes for post');
            }
        },

        fetchComments: async (_, { postId }) => {
            try {
                const result = await CommentDBOperation.FetchComments(postId);
                if (!result || !result.success) {
                    throw new Error('Failed to fetch comments');
                }
                return result.comments.map(comment => ({
                    ...comment,
                    id: comment.id || comment._id?.toString() || null
                }));
            } catch (error) {
                console.error('Error fetching comments for post:', error);
                throw new Error('Failed to fetch comments for post');
            }
        }
    },

    Mutation: {
        createPost: async (_, { input }) => {
            try {
                const { title, content, tags, category, seoTitle, seoDescription } = input;
                const result = await DBOperation.savePost(title, content, tags, category);
                const newPost = processPostData(result.post);
                
                // Attach SEO fields if provided
                if (seoTitle) newPost.seoTitle = seoTitle;
                if (seoDescription) newPost.seoDescription = seoDescription;
                
                return {
                    success: true,
                    message: 'Post created successfully',
                    post: {
                        ...newPost,
                        id: newPost.id
                    }
                };
            } catch (error) {
                console.error('Error creating post:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to create post',
                    post: null
                };
            }
        },
        updatePost: async (_, { id, input }) => {
            try {
                const { title, content, tags, category } = input;
                const result = await DBOperation.EditBlog(id, title, content, tags, category);
                if (!result) {
                    return {
                        success: false,
                        message: 'Post not found or update failed',
                        post: null
                    };
                }
                const updatedPost = processPostData(result);
                
                return {
                    success: true,
                    message: 'Post updated successfully',
                    post: {
                        ...updatedPost,
                        id: updatedPost.id
                    }
                };
            } catch (error) {
                console.error('Error updating post:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to update post',
                    post: null
                };
            }
        },
        deletePost: async (_, { id }) => {
            try {
                const result = await DBOperation.deleteBlog(id);
                if (!result) {
                    return {
                        success: false,
                        message: 'Post not found or deletion failed',
                        post: null
                    };
                }
                return {
                    success: true,
                    message: 'Post deleted successfully',
                    post: null
                };
            } catch (error) {
                console.error('Error deleting post:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to delete post',
                    post: null
                };
            }
        },

        PostLikeToggle: async (_, { postId, userId }) => {
            try {
                const result = await DBOperation.LikePost(postId, userId);
                if (!result || !result.success) {
                    return {
                        success: false,
                        message: 'Post not found or like toggle failed',
                        post: null
                    };
                }
                
                // The LikePost function returns an object with success, liked, likes, and post
                const updatedPost = processPostData(result.post);
                
                return {
                    success: true,
                    message: 'Post like status toggled successfully',
                    post: {
                        id: updatedPost.id,
                        likes: result.likes || updatedPost.likes || 0
                    }
                };
            } catch (error) {
                console.error('Error toggling post like:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to toggle post like',
                    post: null
                };
            }
        },

        SaveComment: async (_, { postID, parentID, userID, content }) => {
            try {
                const result = await CommentDBOperation.SaveComment(postID, parentID, userID, content);
                if (!result || !result.success) {
                    return null;
                }
                
                return {
                    success: true,
                    message: 'Comment saved successfully',
                    comment: {
                        ...result.comment,
                        id: result.comment.id || result.comment._id?.toString() || null
                    }
                };
            } catch (error) {
                console.error('Error saving comment:', error);
                throw new Error('Failed to save comment');
            }
        }

    }
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

export const handler = startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res }),
});

export { handler as GET, handler as POST };