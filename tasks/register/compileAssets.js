module.exports = function(grunt) {
    grunt.registerTask('compileAssets', [
        'clean:dev',
        'jst:dev',
        'less:dev',
        'sass:dev',
        'copy:fonts',
        'copy:dev',
        // 'coffee:dev',
        'webpack:dev'
    ]);
};
