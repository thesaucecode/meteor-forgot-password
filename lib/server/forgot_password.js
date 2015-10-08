Meteor.startup(function() {
  Mandrill.config({
    key: process.env.MANDRILL_API_KEY
  });
});

ForgotPassword = {
  template_slug: null,
  subject: null,
  layoutTemplate: null
};

Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

var sendMail = function(templateName, recipientEmail, globalMergeVars, mergeVars) {
  return Mandrill.messages.sendTemplate({
    template_name: templateName,
    template_content: [
      {}
    ],
    message: {
      global_merge_vars: globalMergeVars,
      merge_vars: mergeVars,
      to: [
        {email: recipientEmail}
      ]
    }
  });
};

// Override accounts-password
Accounts.sendResetPasswordEmail = function(userId, email) {
  // Make sure the user exists, and email is one of their addresses.
  var user = Meteor.users.findOne(userId);
  if (!user)
    throw new Error('Can\'t find user');
  // pick the first email if we weren\'t passed an email.
  if (!email && user.emails && user.emails[0])
    email = user.emails[0].address;
  // make sure we have a valid email
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))
    throw new Error('No such email for user.');
  var token = Random.secret();
  var when = new Date();
  var tokenRecord = {
    token: token,
    email: email,
    when: when
  };
  Meteor.users.update(userId, {$set: {
    'services.password.reset': tokenRecord
  }});

  // before passing to template, update user object with new token
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
  var resetPasswordUrl = Accounts.urls.resetPassword(token);
  // Build email shit
  if (ForgotPassword.template_slug) {
    var globalMergeVars = {};
    var variables = [
      {name: 'resetPasswordUrl', content : resetPasswordUrl},
      {name: 'subject', content : ForgotPassword.subject || 'Reset your password'}
    ];
    var mergeVars = [{
      rcpt: email,
      vars: variables
    }];
    sendMail(ForgotPassword.template_slug, email, globalMergeVars, mergeVars);
  } else {
    throw new Error('saucecode:forgot-password - ForgotPassword.template_slug is not defined');
  }
};
