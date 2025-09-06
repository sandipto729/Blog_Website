import { gql } from '@apollo/client';

const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
            success
            message
        }
    }
`;

export default DELETE_POST;