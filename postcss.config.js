module.exports = {
	plugins: [
		require("autoprefixer")({
			flexbox: "no-2009",
			env: [
				"Android 2.3",
				"Android >= 4",
				"Chrome >= 29",
				"iOS >= 6",
				"Safari >= 7.1"
			]
		})
	]
};
