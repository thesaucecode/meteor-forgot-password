# saucecode:forgot-password

Send a custom forgot password email template using [mandrill](http://mandrill.com/).  This allows you to use the inbuilt accounts-password logic, while keeping your user email branding consistent

Install: `meteor add saucecode:forgot-password`

## Setup

### 1: Set environment variable with your Mandrill API Key

Either: `$ export MANDRILL_API_KEY=xxxxxxxxxxxxx` in your session before starting meteor or `$ MANDRILL_API_KEY=xxxxxxxxxxx meteor`


### 2: Configure 

We expose configuraiton through the namespace `ForgotPassword`.  Set this in your javascript within the scope of both the client and the server.

#### template_slug

This is the mandrill template slug, which is used by the API for selecting the template to send to the user.
```javascript
ForgotPassword.template_slug = 'mandrill-template-slug'
```

#### subject
This is the email template, if you wish for this to be personalised or customised.  You will need to use the `*|subject|*` merge tag in the subject of your mandrill mail template.

```javascript
ForgotPassword.subject = 'Reset your Password'
```

#### layoutTemplate (optional)

This is the layout template to be used when displaying the reset password form to the user.

```javascript
ForgotPassword.layoutTemplate = 'layout'
};
```

[Cron expression help](http://www.cronmaker.com/)
[later.js cron reference](http://bunkat.github.io/later/parsers.html#cron)

If you do not wish to run an out of the box job, simply fun the following:

```javascript
Reporter.remove_job('send_delta_email');
```

### 3: Create a Mandrill Mail Template

Create a [mandrill template](https://mandrillapp.com/templates) to be hit by the API.  The two merge tags that you need to include at some point in your template:

- `*|resetPasswordUrl|*` - This is the url to the reset password form with the password reset token
- `*|subject|*` - You can optionally add this to your mandrill mail template to configure the email subject in your code


