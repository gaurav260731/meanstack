import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import {Post} from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /*Can be done using the Input and output way also*/
  // storedPost: Post[] = [];

  // postAdded(post) {
  //   this.storedPost.push(post);
  // }
  constructor(private autservice: AuthService) {};
  ngOnInit() {
    this.autservice.autoAuthUser();
  }
}
