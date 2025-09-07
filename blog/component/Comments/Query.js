import { gql } from '@apollo/client';

const FETCH_COMMENTS = gql`
    query fetchComments($postId: ID!) {
        fetchComments(postId: $postId) {
            id
            content
            createdAt
            user {
                id
                name
                profilePicture
            }
            replies {
                id
                content
                createdAt
                user {
                    id
                    name
                    profilePicture
                }
            }
        }
    }
`;

export default FETCH_COMMENTS;