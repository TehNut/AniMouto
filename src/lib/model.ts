export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  DARK_OLD = "dark-old",
  CONTRAST = "contrast",
}

export enum Accent {
  BLUE = "blue",
  RED = "red",
  BLUE_DIM = "blue-dim",
  PEACH = "peach",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  PURPLE = "purple",
  PINK = "pink"
}

export type ListConfiguration = {
  combineAnime: boolean;
}

export type ThemeConfiguration = {
  wide: boolean
  primary: Theme
  accent: Accent
};

export type NotificationConfiguration = {
  enablePolling: boolean
  pollingInterval: number
  desktopNotifications: boolean
}

export type ExtensionConfiguration = {
  list: ListConfiguration
  theme: ThemeConfiguration
  notifications: NotificationConfiguration
};

export type User = {
  id: number
  name: string
  avatar: {
    large: string
  }
  siteUrl: string
}