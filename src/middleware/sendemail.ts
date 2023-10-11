import * as nodemailer from 'nodemailer';

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<string> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mridoy031@gmail.com',
      pass: 'usjnybztrzrqlzll',
    },
  });

  const mailOptions = {
    from: 'mridoy031@gmail.com',
    to,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        resolve('Email sent');
      }
    });
  });
}
