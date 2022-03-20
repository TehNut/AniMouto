import gql from "graphql-tag";

export const IncrementProgressMutation = gql`
  mutation ($listId: Int, $mediaId: Int, $progress: Int, $status: MediaListStatus) {
    SaveMediaListEntry(id: $listId, mediaId: $mediaId, progress: $progress, status: $status) {
      __typename
      id
      progress
      status
    }
  }
`;