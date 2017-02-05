//jshint strict: false
module.exports = function (config) {
	config.set({

		basePath: './',

		files: [
			'bower_components/jquery/dist/jquery.min.js',
			'src/app/**/*.js',
			'spec/**/*.js',
		],

		autoWatch: true,

		frameworks: ['jasmine'],

		browsers: ['Chrome'],

		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-junit-reporter'
		],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
