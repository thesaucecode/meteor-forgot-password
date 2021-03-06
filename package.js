Package.describe({
  name: 'saucecode:forgot-password',
  version: '0.3.0',
  summary: 'Send a custom forgot password email template using mandrill'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.use([
    'accounts-password',
    'wylio:mandrill@1.0.1'
  ]);
  api.addFiles('lib/server/forgot_password.js', 'server');

  api.export([
    'ForgotPassword'
  ]);
});
