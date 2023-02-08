const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@acme/tailwind-config")],
  theme: {
    colors: {
      darkGreen: "#53786D",
      darkBg: "#1E1E1E",
      pastelPink: "#E2C2B9",
      pastelGreen: "#D3E4CD",
      midGreen: "#99A799",
      lightBg: "#F8F3ED",
      dark: "#212529",
      orange: "#FFA755",
    },
    // extend: {
    //   fontFamily: {
    //     raleway: ["Raleway", ...defaultTheme.fontFamily.sans],
    //     satoshi: ["Satoshi", ...defaultTheme.fontFamily.sans],
    //     satoshiBold: ["SatoshiBold", ...defaultTheme.fontFamily.sans],
    //   },
    // },
  },
};
