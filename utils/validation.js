import response from './response'

const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

const validate = {};

validate.user = (req, res, next) => {
    if (isEmpty(req.body.username)) {
        return response.sendError(res, new Error("username is required field"), 400)
    }
    if (isEmpty(req.body.password)) {
        return response.sendError(res, new Error("password is required field"), 400)
    }
    next();
};

validate.tweet = (req, res, next) => {
    if (isEmpty(req.body.content)) {
        return response.sendError(res, new Error("content is required field"), 400)
    }
    next();
};

module.exports = validate;