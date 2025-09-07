import { gql } from '@apollo/client';

const SAVE_COMMENT = gql`
    mutation SaveComment($postID: ID!, $parentID: ID, $userID: ID!, $content: String!) {
        saveComment(postID: $postID, parentID: $parentID, userID: $userID, content: $content) {
            success
            message
            comment {
                id
                content
                createdAt
                userId
                postId
                parentId
            }
        }
    }
`;

export default SAVE_COMMENT;