const nodemailer = require('nodemailer');
const ROOT = 'localhost:3000';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login", // default
        user: "bin210697@gmail.com",
        pass: "efxpaoaahufkhjue"
    }
});

exports.sendMail = (receiveEmail, type, data) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: 'bin210697@mail.com',
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

