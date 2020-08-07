export default {
  app: {
    about: {
      name: "AniMouto v{version}",
      description: "A little sister to enhance your AniList experience.",
      links: {
        title: "External Links",
        anilist: "AniList",
        anilist_desc: "This extension's onii-chan",
        homepage: "Homepage",
        homepage_desc: "Our homepage in case you want to share",
        github: "GitHub",
        github_desc: "AniMouto is open source and MIT licensed",
      },
      built_with: {
        title: "Built With",
        node: "Node.js",
        node_desc: "Developement environment",
        vue: "Vue.js",
        vue_desc: "Frontend framework",
        webpack: "Webpack",
        webpack_desc: "Compiler to allow loading as an extension",
        graphql: "GraphQL",
        graphql_desc: "The AniList API query language",
        material_design: "Material Design",
        material_design_desc: "All the icons used",
      },
      changelog: "Changelog"
    },
    login: {
      title: "Login with AniList to use AniMouto",
      auth_code: "Authorization Code",
      submit: "Login",
      sign_up: "Sign Up",
      get_code: "Get Code",
      please_wait: "Once authentication is complete, the page will change.",
      ff_instruct_1: "To obtain an authorization code, click the \"Get Code\" button above. It should open a new window that will let you authenticate with AniList. Once authenticated, it will provide an authorization code for you to copy.",
      ff_instruct_2: "Paste your authorization code into the text field to authenticate. Don't forget to close the extra window when you finish.",
      ff_instruct_3: "Once authentication is complete, the page will change.",
    }
  },
  forum: {
    title: "Recent Forum Activity",
    query_fail: "Failed to get forum activity",
    replied: "{user} replied {time} ago"
  },
  generic_error: "Something bad happened"
}
