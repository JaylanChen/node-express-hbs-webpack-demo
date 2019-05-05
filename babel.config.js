module.exports = function (api) {
    api.assertVersion('^7.4');
    api.cache(true);
    return {
        presets: [
            ['@babel/preset-env', {
                modules: false,
                targets: {
                    browsers: ['> 1%', 'last 10 versions', 'not ie <= 9']
                },
                useBuiltIns: 'entry', // usage
                corejs: 2
            }]
        ],
        plugins: [
            // ['@babel/plugin-transform-runtime', { corejs: 2, helpers: true, regenerator: false, useESModules: true, }]
        ]
    };
};