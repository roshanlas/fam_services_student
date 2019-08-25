const keys = require('./config/keys');
const mailjet = require ('node-mailjet')
    .connect(keys.MJ_APIKEY_PUBLIC, keys.MJ_APIKEY_PRIVATE);
require('dotenv').config();

const sendMail = (type, email, name, id) => {   

    const activationLink = `${process.env.URL}/verify/${id}`
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[{
            "From": {
                "Email": "registration@famservicesstudent.azurewebsites.net",
                "Name": "Female and More"
            },
            "To": [{
                "Email": email,
                "Name": name
            }],
            "Subject": "Female and More | Activate Your Account",
            "TextPart": `Dear ${name}, welcome to Female and More! Our records show you've created an account for ${email}. Please click HERE to validate your email address.`,
            "HTMLPart": `Dear ${name} 1, welcome to Female and More!<br />Our records show you've created an account for ${email}.<br/> Please click <a href="${activationLink}">HERE</a> to validate your email address.`
        }]
    });

    request
    .then((result) => {
        console.log(result.body);
        res.send({ msg: 'done', result: result.body })
    })
    .catch((err) => {
        console.log(err.statusCode);
        res.send({ msg: 'err', result: err })
    })
};

module.exports = sendMail;