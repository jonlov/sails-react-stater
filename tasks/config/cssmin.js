/**
 * Compress CSS files.
 *
 * ---------------------------------------------------------------
 *
 * Minifies css files and places them into .tmp/public/min directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-cssmin
 */
module.exports = function(grunt) {

	grunt.config.set('cssmin', {
		dist: {
			src: ['.tmp/public/styles/production.css'],
			dest: '.tmp/public/styles/production.min.css'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
};
