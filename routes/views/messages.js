var keystone = require('keystone');
var Messages = keystone.list('Messages');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'messages';
	locals.messagesTypes = Messages.fields.messagesType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'messages' }, function (next) {

		var newMessages = new Messages.model();
		var updater = newMessages.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, messagesType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.messagesSubmitted = true;
			}
			next();
		});
	});

	view.render('messages');
};
