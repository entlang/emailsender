import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { EmailObject } from './app.model';

import "rxjs/Rx";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {
    private apiUrl = "http://localhost:3000";
    private options: any;

    constructor(private http: Http) {
        const headers = new Headers({ 'Content-Type': "application/json" });
        this.options = new RequestOptions({ headers: headers });
    }

    sendEmail(emailObject: EmailObject) {
        console.log("emailObject", emailObject);
        const url = `${this.apiUrl}/sendemail`;
        return this.http
            .post(url, JSON.stringify(emailObject), this.options)
            .map(res => res.json);
    }
}
