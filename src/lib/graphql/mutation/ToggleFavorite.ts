import gql from "graphql-tag";

export const ToggleFavoriteMutation = gql`
  mutation($anime: Int, $manga: Int) {
    ToggleFavourite(animeId: $anime, mangaId: $manga) {
      __typename
    }
  }
`;