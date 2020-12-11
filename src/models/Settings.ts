export interface Settings {
  theme: string;

  accent: string;

  wide: boolean;
}

export const defaults: Settings = {
  theme: "light",
  accent: "blue",
  wide: false
};