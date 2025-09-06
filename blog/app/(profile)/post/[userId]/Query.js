import { gql } from '@apollo/client';

const GET_POSTS_BY_AUTHOR = gql`
    query GetPostsByAuthor($authorId: ID!) {
        postsByAuthor(authorId: $authorId) {
            id
            title
            category    
            tags
            content
        }
    }
`;

export default GET_POSTS_BY_AUTHOR;