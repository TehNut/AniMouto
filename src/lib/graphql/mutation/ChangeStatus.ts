import gql from "graphql-tag";

export const ChangeStatusMutation = gql`
  mutation($media: Int, $list: Int, $status: MediaListStatus, $delete: Boolean!) {
    SaveMediaListEntry(mediaId: $media, status: $status) @skip(if: $delete) { 
      id
      status
      __typename
    }
    DeleteMediaListEntry(id: $list) @include(if: $delete) {
      deleted
    }
  }
`;