import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Gets the SendGrid mailer service.
 *
 * @return  {MailService}  The SendGrid mailer service.
 */
export default function getMailer() {
    return sgMail;
}

/**
 * A crude HTML template used to send emails.
 *
 * @param   {string}  body  The email body.
 *
 * @return  {string}        The formatted email.
 */
export function fillTemplate(body) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email from My Data</title>
        <style>
            .container {
                font-family: "Segoe UI", "Helvetica", "Arial", sans-serif;
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${body}
        </div>
    </body>
    </html>`;
}
