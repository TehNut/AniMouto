export interface Settings {
  theme: string;
  accent: string;
  wide: boolean;
  enablePolling: boolean;
  pollingInterval: number;
  desktopNotifications: boolean;
}

export const defaults: Settings = {
  theme: "light",
  accent: "blue",
  wide: false,
  enablePolling: true,
  pollingInterval: 1,
  desktopNotifications: false,
};