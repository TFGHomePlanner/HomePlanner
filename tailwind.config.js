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
			lightGray: "#95999C",
			darkGray: "#2125292c"
		}
	},
	plugins: [],
};