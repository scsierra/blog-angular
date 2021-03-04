import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title: string;
  public category: Category;
  public posts;
  public url: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService: PostService
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPostByCategory();
  }

  getPostByCategory() {
    this._route.params.subscribe(
      params => {
        let id = +params['id'];

        this._categoryService.getCategory(id).subscribe(
          response => {
            if (response.status == 'success') {
              this.category = response.category;
              this._categoryService.getPosts(this.category.id).subscribe(
                response => {
                  if (response.status == 'success') {
                    this.posts = response.posts;
                  } else {
                    this._router.navigate(['/inicio']);
                  }
                },
                error => {
                  console.log(error);
                }
              );
            } else {
              this._router.navigate(['/inicio']);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }

  deletePost(id) {
    this._postService.delete(this.token, id).subscribe(
      response => {
        if (response.status == 'success') {
          this.getPosts();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getPosts() {
    this._postService.getPosts().subscribe(
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

}
