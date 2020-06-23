import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = ' ';
  enteredContent = ' ';
  private mode = 'create';
  private postId: string;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  post: Post;
  //@Output() postCreated = new EventEmitter<Post>();

  constructor(public postservice: PostsService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postservice.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
          });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  /*TEMPLATE DRIVEN APPROACH*/
  // onsavePost(form: NgForm) { ?*Using NgForm is the template driven approach*/
  //   if (form.invalid) {
  //     return;
  //   }
    /*Can be done by using event Emitter also*/
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);

    /*Can be done using services also*/
  //   if (this.mode === 'create') {
  //     this.postservice.addPost(form.value.title, form.value.content);
  //   } else {
  //     this.postservice.updatePost(this.postId, form.value.title, form.value.content);
  //   }

  //   form.resetForm();
  //   this.router.navigate(['/']);
  // }

  /*REACTIVE APPROACH*/

  onsavePost() {
    if (this.form.invalid) {
      return;
    }
    /*Can be done by using event Emitter also*/
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);

    /*Can be done using services also*/
    if (this.mode === 'create') {
      this.postservice.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postservice.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
    this.router.navigate(['/']);
  }

  onImagePick(event: Event) {
    console.log('Image picked clicked');
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
