import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public posts: Array<Post>;
  public identity;
  public token;
  public url;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        let id = +params['id'];
        this.getPosts(id);
      });
  }

  getUser(id){

  }

  getPosts(id) {
    this._userService.getPosts(id).subscribe(
      response => {
        if (response.status == 'success') {
          this.posts = response.posts;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        if (response.status == 'success') {
          this._route.params.subscribe(
            params => {
              let id = +params['id'];
              this.getPosts(id);
            });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
