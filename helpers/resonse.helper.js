function ResponseSuccess(message, data, res) {
    return res.status(200).json({
        message,
        data
    });
}

module.exports = ResponseSuccess;