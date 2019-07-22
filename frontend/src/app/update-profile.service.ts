import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UpdateProfile} from './update-profile'
@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {

  // _url = 'http://localhost:8081/api/v1/product/{emailId}';

  headers = new HttpHeaders({'Access-Control-Allow-Origin' : '*'})
 
   constructor(private _http: HttpClient) { }
 
   updateProductOwnerDetails(update:UpdateProfile,emailId) {
     console.log("from service : ",emailId);
     return this._http.put<UpdateProfile>("http://localhost:8060/api/v1/products/"+emailId,update);
   }

   updateReviewerDetails(update1:UpdateProfile,emailId){
    console.log("from service : ",emailId);
     return this._http.put<UpdateProfile>("http://localhost:8087/api/v1/reviewer/"+emailId,update1);
   }

   getProductOwnerDetails(emailId:String){
    console.log("from service : ",emailId);
    return this._http.get("http://localhost:8060/api/v1/product/"+emailId);
   }

   getReviewerDetails(emailId:String){
    console.log("from service : ",emailId);
    return this._http.get("http://localhost:8087/api/v1/reviewer/"+emailId);
   }


}
