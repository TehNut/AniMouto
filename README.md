# AniMouto ![GitHub package.json version](https://img.shields.io/github/package-json/v/TehNut/AniMouto.svg?color=%230098fd&style=for-the-badge) ![GitHub](https://img.shields.io/github/license/TehNut/AniMouto.svg?style=for-the-badge) [![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/ilhjhegbgdghfkdgeahkpikkjgaaoklh.svg?label=Chrome&style=for-the-badge&logo=google-chrome)](https://chrome.google.com/webstore/detail/animouto/ilhjhegbgdghfkdgeahkpikkjgaaoklh) [![Mozilla Add-on](https://img.shields.io/amo/rating/animouto.svg?label=Firefox&style=for-the-badge&logo=mozilla-firefox)](https://addons.mozilla.org/en-US/firefox/addon/animouto/)

<a href="https://www.animouto.moe/"><img align="right" src="https://www.animouto.moe/static/logo_128px_bg.png"></a>

### Let an imouto enhance your AniList experience.

AniMouto is an unofficial AniList extension which allows quick access to many features of AniList including your current Airing, Anime, and Manga lists, notifications, recent forum activity, and search.

AniMouto is designed to feel like a true extension to AniList by providing a very similar look and feel.

Get it for [Chrome](https://chrome.google.com/webstore/detail/animouto/ilhjhegbgdghfkdgeahkpikkjgaaoklh) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/animouto/).

## Images

<img src="https://www.animouto.moe/static/preview_watching.png" width="280"> <img src="https://www.animouto.moe/static/preview_search.png" width="280"> <img src="https://www.animouto.moe/static/preview_detail.png" width="280"> <img src="https://www.animouto.moe/static/preview_notifications.png" width="280"> <img src="https://www.animouto.moe/static/preview_forum.png" width="280">

## Contributing

Make sure you have [Node.js](https://nodejs.org/) installed.

Run these commands to get the project locally:

```sh
git clone https://github.com/TehNut/AniMouto.git # or clone your own fork
cd AniMouto
npm install
```

### Packaging

#### `npm run build`

Builds the extension into `dist` for testing in the browser. You can load this directory as a temporary extension.

#### `npm run build-zip`

Builds a zip file from the files in `dist` and places it in `dist-zip`. This command should be paired with `build`.

#### `npm run clean`

Cleans the `dist` directory. This command should be run before `build` when intending to package.
