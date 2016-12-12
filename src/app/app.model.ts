export enum EmailType {
    TO = 1,
    BCC,
    CC
}

export class EmailObject {
    emails: Email[];
    subject: string;
    body: string;
}

export class Email {
    email: string;
    type: EmailType;
}