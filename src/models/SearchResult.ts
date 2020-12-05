export interface MediaPage {
  media: Media[];
}

export interface Media {
  id: number;
  title:      Title;
  coverImage: CoverImage;
  mediaListEntry: MediaListEntry;
  type: "MANGA" | "ANIME";
  format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED"
  siteUrl:    string;
}

interface CoverImage {
  medium: string;
  color:  string;
}

interface Title {
  userPreferred: string;
}

interface MediaListEntry {
  id: number;
  status: "CURRENT" | string;
}
