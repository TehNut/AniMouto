import { Media } from './Media';

export interface ListEntry {
  id:        number;
  media:     Media;
  progress:  number;
  status:    MediaListStatus;
  updatedAt: number;
}

export enum MediaListStatus {
  CURRENT = "CURRENT",
  PLANNING = "PLANNING",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
  PAUSED = "PAUSED",
  REPEATING = "REPEATING"
}