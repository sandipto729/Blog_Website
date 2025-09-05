import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import DBOperation from "../DBOperation/Post/Blog.js";

const typeDefs = `#graphql
    # User Schema
    type User {
        id: ID!
        name: String!
        email: String!
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
        likes: [ID]
        readTime: Int
        seoTitle: String
        seoDescription: String
        createdAt: String
        updatedAt: String
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

    type Query {
        posts: [Post!]!
        post(id: ID!): Post
        postsByAuthor(authorId: ID!): [Post!]!
        postsByCategory(category: String!): [Post!]!
        postsByTag(tag: String!): [Post!]!
    }

    type Mutation {
        createPost(input: CreatePostInput!): PostResponse!
    }
`;

const resolvers = {
    Post:{
        author: async (post) => {
            try {
                const author = await DBOperation.fetchUserById(post.author);
                return {
                    ...author.toObject(),
                    id: author._id.toString()
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
                return {
                    ...post.toObject(),
                    id: post._id.toString()
                };
            } catch (error) {
                console.error('Error fetching post:', error);
                throw new Error('Failed to fetch post');
            }
        },

        postsByAuthor: async (_, { authorId }) => {
            try {
                const posts = await DBOperation.fetchBlogsByAuthor(authorId);
                return posts.map(post => ({
                    ...post.toObject(),
                    id: post._id.toString()
                }));
            } catch (error) {
                console.error('Error fetching posts by author:', error);
                throw new Error('Failed to fetch posts by author');
            }
        },

        postsByCategory: async (_, { category }) => {
            try {
                const posts = await DBOperation.fetchBlogsByCategory(category);
                return posts.map(post => ({
                    ...post.toObject(),
                    id: post._id.toString()
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
        }
    },

    Mutation: {
        createPost: async (_, { input }) => {
            try {
                const { title, content, tags, category, seoTitle, seoDescription } = input;
                
                const newPost = await DBOperation.savePost(title, content, tags, category);
                
                // Update SEO fields if provided
                if (seoTitle || seoDescription) {
                    newPost.seoTitle = seoTitle;
                    newPost.seoDescription = seoDescription;
                    await newPost.save();
                }

                return {
                    success: true,
                    message: 'Post created successfully',
                    post: {
                        ...newPost.toObject(),
                        id: newPost._id.toString()
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