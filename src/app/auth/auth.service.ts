import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Authdata } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createdUser(email: string, password: string) {
      const authdata: Authdata = {email: email, password: password};
      this.http.post('http://localhost:3000/api/user/signup', authdata)
      .subscribe(response => {
        console.log(response);
      })
  }
}
