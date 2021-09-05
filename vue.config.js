const CopyWebpackPlugin = require("copy-webpack-plugin");
const packageJson = require("./package.json");

// Background & content scripts to build.
const scripts = {
  background: {
    background: "./src/background-scripts/Background.ts"
  },
  content: {

  },
};

// Format scripts in Webpack format.
const entry = {};
Object.keys(scripts.background).forEach((scriptName) => {
  entry[`background/${scriptName}`] = scripts.background[scriptName];
});
Object.keys(scripts.content).forEach((scriptName) => {
  entry[`content/${scriptName}`] = scripts.content[scriptName];
});

module.exports = {
  productionSourceMap: false,

  // Ensure we don"t hash filenames because we have hard coded paths
  // in index.html.
  filenameHashing: false,

  outputDir: `dist/${process.env.VUE_APP_BROWSER}`,

  // Add webpack jobs.
  chainWebpack: (config) => {
    // Disable code splitting.
    config.optimization.delete("splitChunks");

    // Copy manifest.json.
    config.plugin("copy-manifest").use(CopyWebpackPlugin, [
      [
        {
          // from: process.env.VUE_APP_BROWSER === "firefox" ? "./src/manifest_firefox.json" : "./src/manifest_chrome.json",
          from: "./src/manifest.json",
          to: "manifest.json",
          transform: (content) => {
            const m = JSON.parse(content);

            // Fill manifest values with package value.
            m.version = packageJson.version;

            const matcher = /__(firefox|chromium)__(\w+)/;
            Object.entries(m)
              .filter(([ key ]) => {
                const result = matcher.exec(key);
                return result;
              })
              .forEach(([ key, value ]) => {
                const result = matcher.exec(key);
                delete m[key]
                if (result[1] === process.env.VUE_APP_BROWSER)
                  m[result[2]] = value;
              });

            return JSON.stringify(m, null, 2);
          },
        },
      ],
    ]);

    // GraphQL
    // config.module.rule("graphql")
    //   .test(/\.graphql$/)
    //   .use("raw-loader")
    //   .loader("raw-loader")
    //   .end();

    // Copy locales.
    // config.plugin("copy-locales").use(CopyWebpackPlugin, [
    //   [
    //     {
    //       from: "./src/_locales",
    //       to: "_locales",
    //     },
    //   ],
    // ]);

    // Add background & content scripts to build list.
    config.merge({ entry });

    config.plugin("html").tap((args) => {
      // Prevent css & js files injections in html.
      args[0].inject = false;
      args[0].title = "AniMouto";

      return args;
    });
  },
};