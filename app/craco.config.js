
module.exports = {
    jest: {
        configure(config) {
            config.transformIgnorePatterns = [
                "/node_modules/(?!syllable)/.+\\.js$",
            ];
            return config;
        },
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // delete webpackConfig.plugins.ReactRefreshPlugin;

            webpackConfig.output = {
                ...webpackConfig.output,
                filename: 'static/js/[name].bundle.js',
            };

            webpackConfig.module.rules = [
                ...webpackConfig.module.rules,
                {
                    test: /.*Worker\.js$/,
                    loader: 'worker-loader',
                },
                {
                    test: /.wasm$/,
                    type: 'javascript/auto',
                    loader: 'file-loader',
                },
                /*{
                    type: "javascript/auto",
                    resolve: {}
                }*/
            ];

            return webpackConfig;
        }
    },
};
