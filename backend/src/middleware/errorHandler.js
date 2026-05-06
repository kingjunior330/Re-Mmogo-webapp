// central error handler - express needs all 4 params or it wont treat this as err middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack || err.message)

    const status = err.status || err.statusCode || 500
    const msg = err.message || 'Something went wrong'

    res.status(status).json({
        success: false,
        message: msg,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}

module.exports = errorHandler
