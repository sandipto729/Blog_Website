import { gql } from '@apollo/client';

export const CREATE_POST = gql`
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
            success
            message
            post {
                id
                title
                slug
                content
                category
                tags
                createdAt
            }
        }
    }
`;


export const POST_EDIT = gql`
    mutation UpdatePost($id: ID!, $input: CreatePostInput!) {
        updatePost(id: $id, input: $input) {
            success
            message
            post {
                id
                title
                slug
                content
                category
                tags
                updatedAt
            }
        }
    }
`;