import gql from "graphql-tag";

export const SearchQuery = gql`
  query(
    $search: String!
    $adult: Boolean
    $type: MediaType
    $format: [MediaFormat!]
  ) {
    Page {
      media(search: $search, type: $type, format_in: $format, isAdult: $adult) {
        id
        title {
          userPreferred
        }
        coverImage {
          medium
          color
        }
        mediaListEntry {
          id
          status
        }
        status
        type
        format
        siteUrl
      }
    }
  }
`;

export type SearchResult = {
  media: {
    id: number;
    title: {
      userPreferred: string
    };
    coverImage:     {
      medium: string;
      color: string;
    };
    mediaListEntry?: {
      id: number
      status: "CURRENT" | "PLANNING" | "REPEATING" | "COMPLETED"
    };
    status: string;
    type: string;
    format?: string;
    siteUrl: string;
  }[];
}