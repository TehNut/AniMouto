# AniMouto ![GitHub package.json version](https://img.shields.io/github/package-json/v/TehNut/AniMouto.svg?color=%230098fd&style=for-the-badge) ![GitHub](https://img.shields.io/github/license/TehNut/AniMouto.svg?style=for-the-badge) [![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/ilhjhegbgdghfkdgeahkpikkjgaaoklh.svg?label=Chrome&style=for-the-badge&logo=google-chrome)](https://chrome.google.com/webstore/detail/animouto/ilhjhegbgdghfkdgeahkpikkjgaaoklh) [![Mozilla Add-on](https://img.shields.io/amo/rating/animouto.svg?label=Firefox&style=for-the-badge&logo=mozilla-firefox)](https://addons.mozilla.org/en-US/firefox/addon/animouto/)

<a href="https://animouto.moe/"><img align="right" src="https://animouto.moe/logo_128px_bg.png"></a>

### Let an imouto enhance your AniList experience.

AniMouto is an unofficial AniList extension which allows quick access to many features of AniList including your current Airing, Anime, and Manga lists, notifications, and search.

AniMouto is designed to feel like a true extension to AniList by providing a very similar look and feel.

Get it for [Chrome](https://chrome.google.com/webstore/detail/animouto/ilhjhegbgdghfkdgeahkpikkjgaaoklh) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/animouto/).

## Images

<img src="https://animouto.moe/preview/list.png" width="280"> <img src="https://animouto.moe/preview/search.png" width="280"> <img src="https://animouto.moe/preview/details.png" width="280"> <img src="https://animouto.moe/preview/notifications.png" width="280">

## Contributing

Make sure you have [Node.js](https://nodejs.org/) installed.

Run these commands to get the project locally:

```sh
git clone https://github.com/TehNut/AniMouto.git # or clone your own fork
cd AniMouto
npm install
npm run codegen:graphql
```

The dependencies should now all be installed. Next, run the `watch:*` script. This will watch for file changes and rebuild the extension for each supported browser environment. You can either install the built directories as temporary extensions, or run the relevant `serve` command to launch temporary browser environments with the extension pre-installed.

### Packaging

#### `npm run build:*`

Builds the project for all supported browser environments and places them into `/dist/`.

#### `npm run package`

This is currently not yet implemented.