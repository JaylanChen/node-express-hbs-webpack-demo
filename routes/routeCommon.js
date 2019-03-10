/**
 * seo优化
 * @param {*} vm 
 * @param {*} options 
 */
exports.seoInfo = function (vm, options) {
    var defaults = {
        title: '',
        description: 'node express hbs(handlebars) webpack demo for server side renderer',
        keywords: 'node,Express,Webpack,handlebars,ssr'
    }
    var settings = Object.assign(defaults, options);
    vm.seoInfo = settings;
}