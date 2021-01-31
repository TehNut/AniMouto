export interface Media {
  title:             { userPreferred: string };
  id:                number;
  type:              string;
  episodes:          number;
  chapters:          null;
  siteUrl:           string;
  duration:          number;
  coverImage:        CoverImage;
  status:            string;
  nextAiringEpisode: NextAiringEpisode;
}

export interface CoverImage {
  large: string;
  color: string;
}

export interface NextAiringEpisode {
  episode:         number;
  airingAt:        number;
  timeUntilAiring: number;
}