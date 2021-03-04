import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {

  public post: Post;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.getPost();
  }

  ngOnInit(): void {
  }

  getPost() {
    this._route.params.subscribe(
      params => {
        let id = +params['id'];
        this._postService.getPost(id).subscribe(
          response => {
            if (response.status == 'success') {
              this.post = response.post;
            } else {
              this._router.navigate(['/inicio']);
            }
          },
          error => {
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );
      }
    );
  }

}
