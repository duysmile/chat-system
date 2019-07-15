const nodemailer = require('nodemailer');
const ROOT = 'localhost:3000';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login", // default
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendMail = (receiveEmail, type, data) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: process.env.EMAIL_ID,
        };
        if (type === 'FORGOT_PASSWORD') {
            mailOptions.to = receiveEmail;
            mailOptions.subject = 'Change password';
            mailOptions.html = `Token to reset passowrd: ${data.token}`;
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                return reject(err);
            }
            return resolve(info);
        });
    })
}; 

