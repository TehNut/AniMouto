export default interface Settings {
  theme: string;

  wide: boolean;
}

export const defaults: Settings = {
  theme: "light",
  wide: false
};