import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';


@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public page_title: string;
  public post: Post;
  public categories;
  public identity;
  public token; 
  public status; 

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI: {
      url: global.url + 'post/upload',
      method: "POST",
      headers: {
        "Authorization": this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    attachPinText: 'Sube tu avatar de usuario'
  };

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.page_title = 'Crear una entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);
  }

  onSubmit(form) {
    this._postService.create(this.token, this.post).subscribe(
      response => {
        if (response.status == 'success') {
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['inicio']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status == 'success') {
          this.categories = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  imageUpload(image) {
    let data = JSON.parse(image.response);
    this.post.image = data.image;
  }

}
