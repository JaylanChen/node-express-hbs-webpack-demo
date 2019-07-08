module.exports = function (api) {
    api.assertVersion('^7.4');
    api.cache(true);
    return {
        presets: [
            ['@babel/preset-env', {
                'modules': false,
                'targets': {
                    'browsers': ['> 1%', 'last 10 versions', 'not ie <= 9']
                },
                'useBuiltIns': 'entry', // usage
                'corejs': 3
            }]
        ],
        plugins: [
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
            ['@babel/plugin-proposal-class-properties', { 'loose': true }]
        ]
    };
};