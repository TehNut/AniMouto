import gql from "graphql-tag";

export const MediaQuery = gql`
  query($id: Int!) {
    Media(id: $id) {
      id
      coverImage {
        color
        extraLarge
      }
      bannerImage
      title {
        userPreferred
      }
      mediaListEntry {
        id
        status
      }
      siteUrl
      description(asHtml: true)
      isFavorite: isFavourite
      format
      status(version: 2)
      type
      externalLinks {
        type
        site
        url
        icon
        language
        color
      }
      staff(perPage: 12, sort: [RELEVANCE, ID]) {
        edges {
          id
          role
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
            siteUrl
          }
        }
        pageInfo {
          hasNextPage
        }
      }
      characters(perPage: 12, sort: [ROLE, RELEVANCE, ID]) {
        edges {
          id
          role
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
            siteUrl
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

export interface MediaResult {
  id: number;
  coverImage: {
    color: string
    extraLarge: string
  };
  bannerImage: string;
  title: {
    userPreferred: string
  };
  mediaListEntry?: {
    id: number
    status: "CURRENT" | "PLANNING" | "REPEATING" | "COMPLETED"
  };
  siteUrl: string;
  description: string;
  isFavorite: boolean;
  format: string;
  status: string;
  type: string;
  externalLinks: {
    type: string
    site: string
    url: string
    icon: string
    language: string
    color: string
  }[];
  staff: Person;
  characters: Person;
}

interface Person {
  edges: {
    id: number;
    role: string;
    node: {
      id: number;
      name: {
        userPreferred: string
      };
      image: {
        large: string
      };
      siteUrl: string;
    }
  }[];
  pageInfo: {
    hasNextPage: boolean
  }
}