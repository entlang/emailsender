var express = require("express");
var router = express.Router();

var config = require('./config');

//sender
var fromEmail = "emina.radmanovic@gmail.com";
var fromName = "Emina";

//senbox
var sendgrid_credentials = config.sendgrid_credentials;
var sg = require("sendgrid")(sendgrid_credentials);

//mailgun
var mailgun_api_key = config.mailgun_api_key;
var mailgun_domain = config.mailgun_domain;
var nodemailer = require("nodemailer");

var mg = require("nodemailer-mailgun-transport");

var auth = {
    auth: {
        api_key: mailgun_api_key,
        domain: mailgun_domain
    }
};
var nodemailerMailgun = nodemailer.createTransport(mg(auth));

//api call
router.post("/sendemail",
    function(req, res, next) {
        sendEmailThroughMailgun(req); // use fire and forget
        res.send("Ok");
    });

function sendEmailThroughSendbox(req) {
    const mail = personalizeEmailsSendbox(req.body.emails, req.body.subject, req.body.body);
    const request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: mail
    });
    sg.API(request,
        function(error, response) {
            console.log(response.status);
            if (error) {
                console.log("Error sendEmailThroughSendbox");
            } else {
                console.log("Successfully sent through sendbox");
                // notify user
            }
        });
};

function personalizeEmailsSendbox(emails, subject, message) {
    const helper = require("sendgrid").mail;

    const mail = new helper.Mail();
    var email = new helper.Email(fromEmail, fromName);
    mail.setFrom(email);

    mail.setSubject(subject ? subject : " ");

    personalization = new helper.Personalization();

    for (email of emails) {
        if (email.type === "1") {
            personalization.addTo(new helper.Email(email.email));
        }
        if (email.type === "2") {
            personalization.addBcc(new helper.Email(email.email));
        }
        if (email.type === "3") {
            personalization.addCc(new helper.Email(email.email));
        }
    }

    mail.addPersonalization(personalization);

    const content = new helper.Content("text/plain", (message) ? message : " ");
    mail.addContent(content);

    return mail.toJSON();
}

function sendEmailThroughMailgun(req) {
    const Tos = getEmailArray(req.body.emails, "1");
    const Bccs = getEmailArray(req.body.emails, "2");
    const Ccs = getEmailArray(req.body.emails, "3");

    nodemailerMailgun.sendMail({
            from: fromEmail,
            to: Tos,
            cc: Ccs,
            bcc: Bccs,
            subject: req.body.subject,
            text: (req.body.body) ? req.body.body : " "
        },
        function(err, info) {
            if (err) {
                console.log(`Error sendEmailThroughMailgun: ${err}`);
                //try with sendbox
                sendEmailThroughSendbox(req);
            } else {
                console.log(`Success sendEmailThroughMailgun: ${info}`);
                //notify user it was successfull
            }
        });
    return true;
};

function getEmailArray(emails, type) {
    const result = [];
    for (email of emails) {
        if (email.type === type) {
            result.push(email.email);
        }
    }
    return result;
}

module.exports = router;