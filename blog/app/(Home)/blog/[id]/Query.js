import { gql } from '@apollo/client';

const GET_POST_BY_ID = gql`
    query GetPostById($id: ID!) {
        post(id: $id) {
            id
            title
            content
            excerpt
            tags
            category
            author {
                id
                name
                profilePicture
            }
            slug
            published
            featured
            views
            likes
            readTime
            seoTitle
            seoDescription
            createdAt
            updatedAt
        }
    }
`;

const GET_POST_LIKES= gql`
    query fetchLikes($postId: ID!) {
        fetchLikes(postId: $postId) {
            id
            name
            profilePicture
        }
    }
`;

export {GET_POST_BY_ID, GET_POST_LIKES};