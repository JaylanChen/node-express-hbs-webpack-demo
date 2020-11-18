const { v4: uuidv4 } = require('uuid');

/**
 * 请求ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async function (req, res, next) {
    req['requestId'] = uuidv4()
    next();
}