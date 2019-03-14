module.exports = function (api) {
    api.assertVersion("^7.2");
    api.cache(true);
    return {
        "presets": [
            ["@babel/preset-env", {
                "modules": false,
                "targets": {
                    "browsers": ["> 1%", "last 10 versions", "not ie <= 8"]
                },
                "useBuiltIns": "usage"
            }]
        ],
        "plugins": [
            "@babel/plugin-transform-runtime"
        ]
    };
};