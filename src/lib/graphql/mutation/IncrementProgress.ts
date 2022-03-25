import gql from "graphql-tag";

export const IncrementProgressMutation = gql`
  mutation ($listId: Int, $mediaId: Int, $progress: Int, $volume: Int, $status: MediaListStatus) {
    SaveMediaListEntry(id: $listId, mediaId: $mediaId, progress: $progress, progressVolumes: $volume, status: $status) {
      __typename
      id
      progress
      status
    }
  }
`;