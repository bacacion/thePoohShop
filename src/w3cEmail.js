var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '### your email ###',
    pass: '### your password ###'

  }
});

function sendEmail(to,subject,text){
    const mailOptions={}
    mailOptions.to = to;
    mailOptions.subject =subject
    mailOptions.text =text
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
};
module.exports = sendEmail;
