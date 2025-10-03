import { gql } from '@apollo/client';

export const GET_SIMILAR_POSTS = gql`
    query GetSimilarPosts($postId: ID!, $limit: Int) {
        similarPosts(postId: $postId, limit: $limit) {
            postId
            title
            excerpt
            category
            tags
            similarity
            likes
            comments
        }
    }
`;

export const GET_EMBEDDING_STATS = gql`
    query GetEmbeddingStats {
        embeddingStats {
            totalPosts
            postsWithEmbedding
            coverage
            methods
            dimensions
        }
    }
`;

export const CHECK_EMBEDDING_REFRESH = gql`
    query CheckEmbeddingRefresh($postId: ID!) {
        checkEmbeddingRefresh(postId: $postId)
    }
`;

export const GENERATE_EMBEDDING = gql`
    mutation GenerateEmbedding($postId: ID!, $forceRefresh: Boolean) {
        generateEmbedding(postId: $postId, forceRefresh: $forceRefresh) {
            postId
            method
            dimensions
            cached
        }
    }
`;

export const BATCH_GENERATE_EMBEDDINGS = gql`
    mutation BatchGenerateEmbeddings($postIds: [ID!]) {
        batchGenerateEmbeddings(postIds: $postIds) {
            postId
            method
            dimensions
            cached
        }
    }
`;

export const RESET_CHANGE_COUNTERS = gql`
    mutation ResetChangeCounters($postId: ID!) {
        resetChangeCounters(postId: $postId)
    }
`;