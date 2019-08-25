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
                "Email": "registration@femaleandmore.org",
                "Name": "Female and More"
            },
            "To": [{
                "Email": email,
                "Name": name
            }],
            "Subject": "Female and More | Activate Your Account",
            "TextPart": `Dear ${name}, Welcome to Female and More! Our records show you've created an account for ${email}. Please click HERE to validate your email address.`,
            "HTMLPart": `Dear ${name} 1, <br/><br/>Welcome to Female and More!<br /><br/>Our records show you've created an account for ${email}.<br/><br/> Please click <a href="${activationLink}">HERE</a> to validate your email address.`
        }]
    });

    request
    .then((result) => {
        console.log('sent', result.body);
        return result.body
    })
    .catch((err) => {
        console.log(err.statusCode);
        return err;
    })
};

module.exports = sendMail;