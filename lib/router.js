ForgotPassword = {
  template_slug: null,
  subject: null,
  layoutTemplate: null
};

Meteor.startup(function() {
  Router.map(function () {
    this.route('resetPassword', {
      template: 'resetPassword',
      layoutTemplate: ForgotPassword.layoutTemplate,
      path: '/reset-password/:token',
      onBeforeAction: function() {
        AccountsTemplates.paramToken = this.params.token;
        this.next();
      }
    });
  });
});

if (Meteor.isServer) {
  Accounts.urls.resetPassword = function (token) {
   return Meteor.absoluteUrl('reset-password/' + token);
  };
}
