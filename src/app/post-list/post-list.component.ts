import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // post = [{title: 'First Post', description: 'This is first post'},
  // {title: 'Second Post', description: 'This is Second post'},
  // {title: 'Third Post', description: 'This is Third post'}];

  /*Can be done using input and output way also*/
 // @Input() posts: Post[] = [];

 /*Can be done using services way also*/

 posts: Post[] = [];
 private PostSub: Subscription;
 isLoading = false;
 postLength = 0;
 postPerpage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 4, 5, 10];

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerpage, this.currentPage);
    this.PostSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.postLength = postData.postCount;
        this.posts = postData.posts;
    });
  }

  ngOnDestroy() {
    this.PostSub.unsubscribe();
  }

  onDelete(postId: string) {
      this.isLoading = true;
      console.log('going to delete');
      this.postsService.deletePost(postId).subscribe(() => {
        this.postsService.getPosts(this.postPerpage, this.currentPage);
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postPerpage = pageData.pageSize;
    this.postsService.getPosts(this.postPerpage, this.currentPage);
  }

}
