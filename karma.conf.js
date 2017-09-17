//jshint strict: false
module.exports = function (config) {
	config.set({

		basePath: './',

		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ngDraggable/ngDraggable.js',
			'src/app/**/*.js',
			'spec/**/*.js',
		],

		autoWatch: true,

		frameworks: ['jasmine', 'browserify'],

		browsers: ['Chrome'],
    preprocessors: {
      'src/**/*.js': [ 'browserify' ]
    },
    browserify: {
      debug: true},
		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-junit-reporter',
      'karma-browserify'
		],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
