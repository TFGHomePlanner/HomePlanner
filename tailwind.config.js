/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}"
	],
	theme: {
		extend: {},
		colors: {
			white: "#FFFFFF", light: "#F8F3ED", dark: "#212529", pink: "#F1889F", purple: "#7B61FF",
			blue: "#1E88E5", orange: "#FFA755", green: "#21CF84", lightGray: "#E5E5E5", bgGray: "#D9D9D9",
			darkGray: "#2125292c", placeholderGray: "#929193", red: "#FF3B3F"
		},
		fontFamily: {
			sans: ["Raleway_400Regular", ...defaultTheme.fontFamily.sans],
			raleway: ["Raleway_400Regular", ...defaultTheme.fontFamily.sans],
			ralewayMedium: ["Raleway_500Medium", ...defaultTheme.fontFamily.sans],
			ralewaySemi: ["Raleway_600Semibold", ...defaultTheme.fontFamily.sans],
			ralewayBold: ["Raleway_700Bold", ...defaultTheme.fontFamily.sans],
			ralewayBlack: ["Raleway_900Black", ...defaultTheme.fontFamily.sans],
			belleza: ["Belleza_400Regular", ...defaultTheme.fontFamily.sans]
		}
	},
	plugins: [],
};