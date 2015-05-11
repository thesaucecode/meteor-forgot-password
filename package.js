Package.describe({
  name: 'saucecode:forgot-password',
  version: '0.1.0',
  summary: 'Send a custom forgot password email template using mandrill'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use(['templating'], 'client');
  api.use(['accounts-password', 'wylio:mandrill@0.2.1', 'iron:router@1.0.7']);
  api.addFiles('lib/client/reset_password.html', 'client');
  api.addFiles('lib/router.js');
  api.addFiles('lib/server/forgot_password.js', 'server');

  api.export([
    'ForgotPassword'
  ]);
});
