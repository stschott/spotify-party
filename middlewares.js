const { ErrorHandler, handleError } = require('./helpers/ErrorHandler');

const notFound = (req, res, next) => {
    const error = new ErrorHandler(404, 'Not found');
    // res.status(400);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // res.status(statusCode);
    handleError(err, res);
};

module.exports = {
    notFound,
    errorHandler
}