import { gql } from '@apollo/client';

const Fetch_POSTS = gql`
    query GetPosts {
        posts {
            id
            title
            category
            tags
            author {
                id
                name
                profilePicture
            }
            published
            views
            readTime
            seoTitle
            seoDescription
            createdAt
            updatedAt
        }
    }
`;

export default Fetch_POSTS;