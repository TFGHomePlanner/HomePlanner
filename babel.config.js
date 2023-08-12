module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'nativewind/babel',
			require.resolve('expo-router/babel'),
			['@babel/plugin-transform-private-property-in-object', { 'loose': true }],
			['@babel/plugin-transform-class-properties', { 'loose': true }],
			['@babel/plugin-transform-private-methods', { 'loose': true }],
		],
	};
};