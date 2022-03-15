import gql from "graphql-tag";

export const RecentMediaQuery = gql`
  query($perPage: Int, $sort: [MediaSort], $type: MediaType, $formatIn: [MediaFormat]) {
    Page(perPage: $perPage) {
      media(sort: $sort, type: $type, format_in: $formatIn, isAdult: false) {
        id
        siteUrl
        format
        status(version: 2)
        title {
          userPreferred
        }
        coverImage {
          color
          extraLarge
        }
      }
    }
  }
`;

export type RecentMedia = {
  media: {
    id: number;
    siteUrl: string;
    format: string
    status: string
    title: {
      userPreferred: string
    };
    coverImage:     {
      extraLarge: string;
      color: string;
    };
  }[];
}