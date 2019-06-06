function ResponseSuccess(message, data, res) {
    return res.status(200).json({
        success: true,
        data: {
            message,
            data
        }
    });
}

function ResponseError(message, res) {
    return res.status(200).json({
        success: false,
        message
    });
}

module.exports = {
    ResponseSuccess,
    ResponseError
};