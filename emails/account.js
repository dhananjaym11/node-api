const sgMail = require('@sendgrid/mail');

const apiKey = "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"
sgMail.setApiKey(apiKey)

const msg = {
  to: 'dhananjaymane11@gmail.com',
  from: 'manedhanu@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
try {
	sgMail.send(msg, function(error){
		if (error) {
			console.error(error.message);
		}
	});
} catch(e) {
	console.log(e)
}