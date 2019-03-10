const routeCommon = require("../routes/routeCommon");

/**
 * 500
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async function(err, req, res, next) {
  res.status(err.status || 500);
  if (process.env.NODE_ENV === "local") {
    // 非生产环境 打印错误堆栈信息
    console.log(err.stack);
  }
  if (err.status == 401) {
    res.redirect("/login");
  } else if (err.status == 404) {
    await require("./notFound")(req, res, next);
  } else {
    if (req.xhr) {
      return res.json({
        errorCode: 500,
        errorMsg: "服务器错误",
        httpStatusCode: 500,
        instance: null,
        success: false
      });
    }
    var vm = {};
    routeCommon.seoInfo(vm, {
      title: "服务器错误"
    });
    res.status(500);
    vm.errorMsg = err.message;
    // 不使用模板
    // vm.layout = false;
    res.render("shared/500", vm);
  }
};
