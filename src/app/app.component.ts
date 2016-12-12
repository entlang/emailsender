import { Component } from "@angular/core";
import { AppService } from "./app.service";
import { EmailObject } from "./app.model";
import { Email } from "./app.model";
import { EmailType } from "./app.model";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "Email Sending Demo";
    emails: Email[];
    emailObject: EmailObject;

    email: string;
    duplicateEmail: boolean;
    emailToExists: boolean;

    constructor(private appService: AppService) {
        this.initializeObect();
    }

    private initializeObect() {
        this.emails = [];
        this.emailObject = new EmailObject();
        this.emailObject.emails = this.emails;
        this.emailObject.subject = "";
        this.emailObject.body = "";
    }

    addEmail(newEmail: string, type: EmailType) {
        console.log(newEmail, type, this.emails);
        if (newEmail && type) {
            if (this.checkIfEmailExists(newEmail)) {
                //inform usser
                this.duplicateEmail = true;
                setTimeout(() => {
                        this.duplicateEmail = false;
                    },
                    2000);
            } else {
                const email = new Email();
                email.email = newEmail;
                email.type = type;
                this.emails.push(email);

                this.email = "";

                this.emailToExists=this.checkIfEmailToExists();
            }
        }
    }

    checkIfEmailExists(newEmail: string) {
        let exists = false;
        for (var i = 0, len = this.emails.length; i < len; ++i) {
            if (this.emails[i].email.toLowerCase() === newEmail.toLowerCase()) {
                exists = true;
                break;
            }
        }
        return exists;
    }

    removeEmail(email: Email) {
        console.log(email);
        for (var i = 0, len = this.emails.length; i < len; ++i) {
            if (this.emails[i].email.toLowerCase() === email.email.toLowerCase()) {
                this.emails.splice(i, 1);
                this.emailToExists = this.checkIfEmailToExists();
                break;
            }
        }
    }

    checkIfEmailToExists() {
        let exist = false;
        for (var i = 0, len = this.emails.length; i < len; ++i) {
            if (+this.emails[i].type === EmailType.TO) {
                exist = true;
                break;
            }
        }
        return exist;
    }

    sendEmail() {
        this.appService.sendEmail(this.emailObject)
            .subscribe(res => {
                console.log(res);
                this.initializeObect();
            });
    }

}