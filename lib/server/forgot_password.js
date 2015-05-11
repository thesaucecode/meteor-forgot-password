Meteor.startup(function() {
  Meteor.Mandrill.config({
    "key": process.env.MANDRILL_API_KEY
  });
});

var sendMail = function(template_name, recipient_email, global_merge_vars, merge_vars) {
  return Meteor.Mandrill.sendTemplate({
    "template_name": template_name,
    "template_content": [
      {}
    ],
    "message": {
      "global_merge_vars": global_merge_vars,
      "merge_vars": merge_vars,
      "to": [
        {"email": recipient_email}
      ]
    }
  });
};

// Override accounts-password
Accounts.sendResetPasswordEmail = function (userId, address) {
  // Make sure the user exists, and email is one of their addresses.
  var user = Meteor.users.findOne(userId);
  if (!user)
    throw new Error("Can't find user");
  // pick the first email if we weren\'t passed an email.
  if (!email && user.emails && user.emails[0])
    email = user.emails[0].address;
  // make sure we have a valid email
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))
    throw new Error("No such email for user.");
  var token = Random.secret();
  var when = new Date();
  var tokenRecord = {
    token: token,
    email: email,
    when: when
  };
  Meteor.users.update(userId, {$set: {
    "services.password.reset": tokenRecord
  }});
  // before passing to template, update user object with new token
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
  var resetPasswordUrl = Accounts.urls.resetPassword(token);
  // Build email shit
  if (ForgotPassword.template_slug) {
    var global_merge_vars = {},
        variables = [
          {"name": "resetPasswordUrl", "content" : resetPasswordUrl},
          {"name": "subject", "content" : ForgotPassword.subject || "Reset your password"}
        ];
    var merge_vars = [{
      "rcpt": email,
      "vars": variables 
    }];
    sendMail(ForgotPassword.template_slug, email, global_merge_vars, merge_vars);
  }
};
