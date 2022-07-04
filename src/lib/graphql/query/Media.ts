import gql from "graphql-tag";

export const MediaQuery = gql`
  query($id: Int!) {
    Media(id: $id) {
      id
      coverImage {
        color
        extraLarge
        large
        medium
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
      averageScore
      externalLinks {
        type
        site
        url
        icon
        language
        color
      }
      relations {
        edges {
          relationType
          node {
            ...SimpleMedia
          }
        }
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
      recommendations(perPage: 8, sort: [ RATING_DESC, ID ]) {
        pageInfo {
          hasNextPage
        }
        nodes {
          id
          rating
          mediaRecommendation {
            ...SimpleMedia
          }
        }
      }
    }
  }

  fragment SimpleMedia on Media {
    id
    title {
      userPreferred
    }
    format
    status
    coverImage {
      color
      large
    }
  }
`;

export interface MediaResult {
  id: number;
  coverImage: {
    color: string
    extraLarge: string
    large: string
    medium: string
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
  averageScore: number;
  externalLinks: {
    type: string
    site: string
    url: string
    icon: string
    language: string
    color: string
  }[];
  relations: {
    edges: {
      relationType: string
      node: SimpleMedia
    }[]
  }
  staff: Person;
  characters: Person;
  recommendations: {
    pageInfo: {
      hasNextPage: boolean
    }
    nodes: {
      id: number
      rating: number
      mediaRecommendation: SimpleMedia
    }[]
  }
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

interface SimpleMedia {
  id: number
  format: string
  status: string
  title: {
    userPreferred: string
  }
  coverImage: {
    color: string
    large: string
  }
}