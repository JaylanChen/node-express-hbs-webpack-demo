const routeCommon = require('../routes/routeCommon');

/**
 * 404
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async function (req, res, next) {
    if (req.xhr) {
      return res.json({
        "errorCode": 404,
        "errorMsg": "Not Found",
        "httpStatusCode": 404,
        "instance": null,
        "success": false
      })
    }
    var vm = {};
    routeCommon.seoInfo(vm, {
      title: 'Not Found'
    });
    res.status(404).render('shared/404', vm);
}