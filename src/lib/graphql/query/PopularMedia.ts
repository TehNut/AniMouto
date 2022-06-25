import gql from "graphql-tag";

export const PopularMediaQuery = gql`
  {
    Page {
      media(sort: [ TRENDING_DESC, ID ], isAdult: false) {
        id
        coverImage {
          medium
        }
      }
    }
  }
`;

export type PopularMediaResult = {
  media: {
    id: number;
    coverImage:     {
      medium: string;
    };
  }[];
}