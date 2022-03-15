import gql from "graphql-tag";

export const ViewerQuery = gql`
  {
    Viewer {
      id
      name
      siteUrl
      avatar {
        large
      }
    }
  }
`;