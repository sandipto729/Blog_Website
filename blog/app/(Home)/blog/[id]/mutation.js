import { gql } from '@apollo/client';

export const POST_LIKE_TOGGLE = gql`
    mutation PostLikeToggle($postId: ID!, $userId: ID!) {
        PostLikeToggle(postId: $postId, userId: $userId) {
            success
            message
            post {
                id
                likes
            }
        }
    }
`;

export default POST_LIKE_TOGGLE;