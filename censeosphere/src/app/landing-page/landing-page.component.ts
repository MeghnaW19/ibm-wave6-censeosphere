import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { LandingpageService } from '../landingpage.service';
import { Authentication } from '../authentication';
import { LoginvalidationService } from '../loginvalidation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Reviewer } from '../reviewer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { error } from 'util';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '../review.service';


const helper = new JwtHelperService();
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
 
})

export class LandingPageComponent implements OnInit {
  showFiller = false;
  productDetails = [];
  categories = [];
  subCategories = [];
  job = "";
  showComponent:any;
  reviewsgiven = [];
  productname = "";
  // validatingForm: FormGroup;
  productDetails1 = [];
 route: ActivatedRoute;

  form=new FormGroup({
    emailId: new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',Validators.required)
  })
  helper = new JwtHelperService();
  auth: Authentication = new Authentication();


  constructor(private router: Router, private landingpageservice: LandingpageService, private loginvalidation: LoginvalidationService,private productService:ProductService,
    private reviewService: ReviewService) { }

  ngOnInit() {

    this.landingpageservice.getRecentProducts().subscribe((data: any) => {
      console.log(data);
      this.productDetails = data;
      console.log("pooja",this.productDetails);
      
      for (let i = 0; i < (this.productDetails).length; i++){
        this.productname = this.productDetails[i].productName;


        this.reviewService.getAllReviewsbyName(this.productname).subscribe((data: any) => {
          console.log("priyanka" + JSON.stringify(data));
          this.reviewsgiven = data;
          
          console.log("length of product list", this.reviewsgiven.length);
    
    
          this.productDetails = this.productDetails.map((e, j) => {
            if (e.productName === data[0].productName) {
              e.size = this.reviewsgiven.length;
    
            }
            console.log(e, "list size")
            return e
          })
    
        });
      
      }
    })

    this.landingpageservice.getAllCategory().subscribe((data: any) => {
      console.log(data);
      this.categories = data;
    })
    this.landingpageservice.getAllSubCategories().subscribe((data: any) => {
      console.log(data);
      this.subCategories = data;
    })


  
  }

  onClick(role) {
    console.log(role);
    this.router.navigateByUrl("/account/" + role);
  }
  onClickPO(role1) {
    console.log(role1);
    this.router.navigateByUrl("/account/" + role1);
  }
  reviewer(emailId, password): any {

    this.auth.emailId = emailId;
    this.auth.password = password;
    this.loginvalidation.login(this.auth).
      subscribe((data: any) => {
        console.log("data from backend ", data.token);
        if (data.token) {
          console.log("in if");

          let role = this.helper.decodeToken(data.token).sub;
          console.log("we are having this......", data.token);

          console.log("in if print email   " + emailId);
          console.log("in if print password   " + password);
          console.log("in if print role   ", role);

          sessionStorage.setItem('reviewerEmail',emailId);
          
          if (role == this.job) {
            console.log(role);
            console.log("in if1");
            this.router.navigateByUrl("/reviewerdash");

          }
          else {
            alert("provide valid credentailds");
          }
        }

      })
  }
  productOwner(emailId, password): any {
    this.auth.emailId = emailId;
    this.auth.password = password;
    this.loginvalidation.login(this.auth).
      subscribe((data: any) => {
        console.log("data from backend ", data.token);
        if (data.token) {
          console.log("in if");

          let role = this.helper.decodeToken(data.token).sub;
          console.log("we are having this......", data.token);

          console.log("in if print email   " + emailId);
          console.log("in if print password   " + password);
          console.log("in if print role   ", role);

          sessionStorage.setItem('productOwnerEmail',emailId);
          if (role == this.job) {
            console.log(role);
            console.log("in if1");
            console.log(emailId);
            this.router.navigateByUrl("/productownerdashboard/"+ emailId);

          }
          else {
            alert("provide valid credentailds");
          }
        }

      })


  }

  onclick(rrole) {
    console.log(rrole);
    this.job = rrole;
  }
  onclick1(prole) {
    console.log(prole);
    this.job = prole;
  }

  newlogin(lemailId, lpassword): any {

    this.auth.emailId = lemailId;
    this.auth.password = lpassword;
    this.loginvalidation.login(this.auth).
      subscribe((data: any) => {
        console.log("data from backend ", data.token);
        if (data.token) {
          console.log("in if");

          let role = this.helper.decodeToken(data.token).sub;
          console.log("we are having this......", data.token);

          console.log("in if print email   " + lemailId);
          console.log("in if print password   " + lpassword);
          console.log("in if print role   ", role);

          if (role == 'reviewer') {
            console.log(role);
            console.log("in if1");

            this.router.navigateByUrl("/reviewerdash");
          }
          else if (role == 'product-owner') {
            this.router.navigateByUrl("/productownerdashboard");
          }
        }
      },
        error => {
          alert("Invalid credential");
        });

  }

  
  searchproductL(product){
     console.log(product);
      this.productService.getProduct(product).
      subscribe(data=>{
          console.log("product info : ",data);
          let a = JSON.stringify(data)
          sessionStorage.setItem('data123', a);

          this.showComponent = true;
                });
  } 

  imageclick(product){
    let a = JSON.stringify(product)
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log("product info in card : "+JSON.stringify(product));
    sessionStorage.setItem('data', a);
    this.router.navigateByUrl("/productreview"); 
   } 
}


