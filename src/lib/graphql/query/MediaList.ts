import gql from "graphql-tag";

export const MediaListQuery = gql`
  query($id: Int!, $type: MediaType!) {
    Page {
      mediaList(userId: $id, type: $type, status_in: [ CURRENT, REPEATING ], sort: [UPDATED_TIME_DESC]) {
        id
        progress
        media {
          id
          status
          episodes
          chapters
          volumes
          title {
            userPreferred
          }
          coverImage {
            extraLarge
            color
          }
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
        }
      }
    }
  }
`;

export interface MediaListResult {
  mediaList: {
    id: number;
    progress: number;
    media: {
      id: number;
      status: string;
      episodes?: number;
      chapters?: number;
      volumes?: number
      title: {
        userPreferred: string;
      };
      coverImage: {
        extraLarge: string;
        color?: string;
      };
      nextAiringEpisode?: {
        episode: number;
        timeUntilAiring: number;
      };
    };
  }[]
};