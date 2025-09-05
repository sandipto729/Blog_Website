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

export default GET_POST_BY_ID;