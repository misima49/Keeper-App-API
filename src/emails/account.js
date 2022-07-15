const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']

apiKey.apiKey = process.env.SIB_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email: 'mirinaru33@gmail.com',
    name: 'Keeper App',
}
// const receivers = [
//     {
//         email: 'mrinalsinghmalav@yahoo.com',
//     },
// ]


const sendWelcomeEmail = (email, name) => {
    try {
        tranEmailApi
            .sendTransacEmail({
                sender,
                to: [{
                    email: email
                }],
                subject: `${name}, welcome to Keeper App`,
                textContent: `Thank you for using Keeper App to keep your schedule on line,\nKeeper App dev`,
            });
    } catch (error) {
        console.log(error);
    }
};

const sendSeparationEmail = (email, name) => {
    try {
        tranEmailApi
            .sendTransacEmail({
                sender,
                to: [{
                    email: email
                }],
                subject: 'Sorry to see you go!',
                textContent: `Greetings ${name},\nHope I see you agian in future after I have improved the app. And to 
                    that end, feel free to reply to this mail with any suggestions or issues that you have for the app.\nKeeper App dev`
            })
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendSeparationEmail
}