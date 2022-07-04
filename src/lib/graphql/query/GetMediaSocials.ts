import gql from "graphql-tag";

export const GetMediaSocialsQuery = gql`
  query($id: Int!) {
    Page {
      mediaList(mediaId: $id, isFollowing: true, sort: UPDATED_TIME_DESC) {
        id
        status
        score(format: POINT_100)
        progress
        notes
        repeat
        user {
          id
          name
          siteUrl
          avatar {
            large
          }
        }
      }
    }
  }
`;

export type GetMediaSocials = {
  mediaList: {
    id: number;
    status: string;
    score: number
    progress: number
    notes: string
    repeat: number
    user: {
      id: number
      name: string
      siteUrl: string
      avatar: {
        large: string
      }
    };
  }[];
}