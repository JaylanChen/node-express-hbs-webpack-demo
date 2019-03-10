let handlebarsHelpers = require('handlebars-helpers')(['array', 'string', 'comparison']);

handlebarsHelpers.renderSection = require('./renderSection');

module.exports = handlebarsHelpers