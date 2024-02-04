import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';
import i18next from 'i18next';

const t = i18next.t;

let transporter = {
  sendMail: (mail, callback) => {
    console.log(mail);
    callback(null, null);
  },
};

// configure AWS SDK
if (process.env.AWS_ACCESS_KEY_ID) {
  const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'eu-frankfurt-1',
  });

  // create Nodemailer SES transporter
  transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });
}

export const sendEmailConfirmationMail = async (
  link: string,
  recipientEmail: string,
  lng: string = 'en',
) => {
  // send some mail
  transporter.sendMail(
    {
      from: 'no-reply@example.com',
      to: recipientEmail,
      subject: t('email-confirmation.subject', { ns: 'email', lng }),
      text: t('email-confirmation.text', { ns: 'email', lng, link }),
      html: t('email-confirmation.htmlText', { ns: 'email', lng, link }),
    },
    (err, info) => {
      if (err) {
        console.error(err);
      }
      if (info) {
        console.log(info.envelope);
        console.log(info.messageId);
      }
    },
  );
};

export const sendPasswordResetMail = async (
  link: string,
  recipientEmail: string,
  lng: string = 'en',
) => {
  // send some mail
  transporter.sendMail(
    {
      from: 'no-reply@example.com',
      to: recipientEmail,
      subject: t('password-reset.subject', { ns: 'email', lng }),
      text: t('password-reset.text', { ns: 'email', lng, link }),
      html: t('password-reset.htmlText', { ns: 'email', lng, link }),
    },
    (err, info) => {
      if (err) {
        console.error(err);
      }
      if (info) {
        console.log(info.envelope);
        console.log(info.messageId);
      }
    },
  );
};
