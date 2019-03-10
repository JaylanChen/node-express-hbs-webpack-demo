const home = require('./home');

module.exports = function (app) {
    app.use("/", home);
};