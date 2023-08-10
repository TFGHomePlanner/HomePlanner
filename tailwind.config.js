/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}"
	],
	theme: {
		extend: {},
		colors: {
			white: "#FFFFFF",
			light: "#F8F3ED",
			dark: "#212529",
			pink: "#F1889F",
			purple: "#7B61FF",
			blue: "#1E88E5",
			orange: "#FFA755",
			lightGray: "#E5E5E5",
			darkGray: "#2125292c",
			placeholderGray: "#929193"
		}
	},
	plugins: [],
};