const keys = require('./config/keys');
const mailjet = require ('node-mailjet')
    .connect(keys.MJ_APIKEY_PUBLIC, keys.MJ_APIKEY_PRIVATE);
require('dotenv').config();

const sendMail = (type, email, name, id) => {
    let message;
    const activationLink = `${process.env.URL}/verify/${id}`
    
    if (type === "updateEmail") {
        message = {
            "From": {
                "Email": "registration@femaleandmore.org",
                "Name": "Female and More"
            },
            "To": [{
                "Email": email,
                "Name": name
            }],
            "Subject": "Female and More | Verify Your Account",
            "TextPart": `Dear ${name}, Welcome to Female and More! Our records show you've updated your account for ${email}. Please click HERE to validate your email address. Best, Female and More Team`,
            "HTMLPart": `Dear ${name}, <br/><br/>Welcome to Female and More!<br /><br/>Our records show you've updated an account for ${email}.<br/><br/> Please click <a href="${activationLink}">HERE</a> to validate your email address.<br/><br/>Best,<br/>Female and More Team`
        }

    } else {
        message = {
            "From": {
                "Email": "registration@femaleandmore.org",
                "Name": "Female and More"
            },
            "To": [{
                "Email": email,
                "Name": name
            }],
            "Subject": "Female and More | Activate Your Account",
            "TextPart": `Dear ${name}, Welcome to Female and More! Our records show you've created an account for ${email}. Please click HERE to validate your email address. Best, Female and More Team`,
            "HTMLPart": `Dear ${name}, <br/><br/>Welcome to Female and More!<br /><br/>Our records show you've created an account for ${email}.<br/><br/> Please click <a href="${activationLink}">HERE</a> to validate your email address.<br/><br/>Best,<br/>Female and More Team`
        }
    }
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages": [message]
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