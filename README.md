# AniMouto

<a href="https://www.animouto.moe/"><img align="right" src="https://www.animouto.moe/static/logo_128px_bg.png"></a>

### Let an imouto enhance your AniList experience.

AniMouto is an unofficial AniList extension which allows quick access to many features of AniList including your current Airing, Anime, and Manga lists, notifications, recent forum activity, and search.

AniMouto is designed to feel like a true extension to AniList by providing a very similar look and feel.

Get it for [Chrome](https://chrome.google.com/webstore/detail/animouto/ilhjhegbgdghfkdgeahkpikkjgaaoklh) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/animouto/).

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
