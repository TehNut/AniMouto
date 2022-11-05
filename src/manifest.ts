const sharedManifest = {
  icons: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    128: "icons/128.png",
  },
  permissions: [
    "storage",
    "identity",
    "alarms"
  ],
  optional_permissions: [
    "notifications"
  ]
};

const browserAction = {
  default_icon: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
  },
  default_popup: "src/entries/popup/index.html",
};

export const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ["src/entries/background/script.ts"],
    persistent: true,
  },
  browser_action: browserAction,
  manifest_version: 2,
  permissions: [...sharedManifest.permissions],
};

export const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: "src/entries/background/serviceWorker.ts",
  },
  manifest_version: 3,
};
