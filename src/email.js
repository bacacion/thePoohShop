var nodemailer = require('nodemailer');

module.exports = function(credentials) {
  var mailTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: 'dingnew01@gmail.com',
      pass: 'bb810529'
    }
  });
  var from = '"Meadowlark Travel" <cythilya@gmail.com>';
  var errorRecipient = 'cythilya@gmail.com';
  return {
    send: function(to, subj, body) {
      mailTransport.sendMail({
        from: 'Meadowlark Travel <cythilya@gmail.com>',
        to: 'Cythilya <cythilya@gmail.com>',
        subject: 'Hi :)',
        html: '<h1>Hello</h1><p>Nice to meet you.</p>'
      }, function(err) {
        if(err) {
          console.log('Unable to send email: ' + err);
        }
      });
    },
    emailError: function(message, filename, exception) {
      var body = '<h1>Meadowlark Travel Site Error</h1>' + 'message:<br><pre>' + message + '</pre><br>';
      if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
      if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
      mailTransport.sendMail({
        from: from,
        to: errorRecipient,
        subject: 'Meadowlark Travel Site Error',
        html: body,
        generateTextFromHtml: true
      }, function(err){
        if(err) {
          console.log('Unable to send email: ' + err);
        }
      });
    }
  }
};