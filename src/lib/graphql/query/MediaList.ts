import gql from "graphql-tag";

export const MediaListQuery = gql`
  query($id: Int!, $type: MediaType!) {
    Page {
      mediaList(userId: $id, type: $type, status_in: [ CURRENT, REPEATING ], sort: [UPDATED_TIME_DESC]) {
        id
        progress
        status
        media {
          id
          status
          format
          episodes
          duration
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
    status: string;
    media: {
      id: number;
      status: string;
      format: string;
      episodes?: number;
      duration?: number;
      chapters?: number;
      volumes?: number;
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