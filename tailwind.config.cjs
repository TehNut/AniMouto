const { black, transparent, current } = require("tailwindcss/colors");

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      variable: withOpacityValue("--color-variable"),
      "variable-hex": "var(--color-variable)",
      accent: withOpacityValue("--color-accent"),
      background: withOpacityValue("--color-background"),
      foreground: withOpacityValue("--color-foreground"),
      "foreground-grey": {
        100: withOpacityValue("--color-foreground-grey"),
        900: withOpacityValue("--color-foreground-grey-dark"),
      },
      "foreground-blue": {
        100: withOpacityValue("--color-foreground-blue"),
        900: withOpacityValue("--color-foreground-blue-dark"),
      },
      "text": {
        100: withOpacityValue("--color-text-bright"),
        200: withOpacityValue("--color-text-lighter"),
        300: withOpacityValue("--color-text-light"),
        400: withOpacityValue("--color-text"),
      },
      shadow: withOpacityValue("--color-shadow"),
      overlay: withOpacityValue("--color-overlay"),
      blue: withOpacityValue("--color-blue"),
      red: withOpacityValue("--color-red"),
      "blue-dim": withOpacityValue("--color-blue-dim"),
      white: withOpacityValue("--color-white"),
      black: withOpacityValue("--color-black"),
      peach: withOpacityValue("--color-peach"),
      orange: withOpacityValue("--color-orange"),
      yellow: withOpacityValue("--color-yellow"),
      green: withOpacityValue("--color-green"),
      purple: withOpacityValue("--color-purple"),
      pink: withOpacityValue("--color-pink"),
      transparent,
      current,
      black
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
