var path = require("path");
var project_dir = __dirname + '/../../';
var webpack = require("webpack");

var prod = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

var pluggins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    })
    // function() {
    //   this.plugin("done", function(stats) {
    //     require("fs").writeFileSync(
    //       path.join(__dirname, "…", "stats.json"),
    //       JSON.stringify(stats.toJson()));
    //   });
    // }
    ];

if (prod)
    pluggins.push(new webpack.optimize.UglifyJsPlugin({mangle: true, sourcemap: false, minimize: true}));

module.exports = function(grunt) {
    grunt.config.set('webpack', {
        dev: {
            context: path.resolve(project_dir, 'assets'),
            entry: require('../pipeline').jsFilesToInjectWebPack,
            module: {
                rules: [
                    {
                        test: /\.js?$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            {
                                loader: 'babel-loader',
                                query: {
                                    presets: [
                                        'react', 'es2015'
                                    ],
                                    plugins: []
                                }
                            }

                        ]
                    }
                ]
            },
            resolve: {
                modules: [
                    path.resolve(project_dir, 'assets/js'),
                    path.resolve(project_dir, 'assets/bower_components'),
                    "node_modules"
                ],
                alias: {
                    Dep: path.resolve(project_dir, 'assets/js/dependencies/')
                }
            },
            output: {
                path: ".tmp/public/js",
                filename: "bundle.js",
                // chunkFilename: '[chunkhash].js',
                publicPath: "/js/"
            },
            plugins: pluggins,

            hot: false,
            inline: false,
            keepalive: false,
            watch: false,
            progress: false,

            stats: {
                colors: true,
                hash: true,
                version: false,
                timings: true,
                assets: true,
                chunks: true,
                modules: true,
                reasons: false,
                children: false,
                source: false,
                errors: false,
                errorDetails: false,
                warnings: false,
                publicPath: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
};
