import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})

  
export class AdminService {


baseURL : string = environment.baseURL

  constructor(private http:HttpClient) {}


  getUsers(): Observable<any>{
    
    return this.http.get(`${this.baseURL}/admin/users`, httpOptions)
  }

  blockUnblockUser(id:string):Observable<any>{
    console.log(id,'id')
    return this.http.patch(`${this.baseURL}/admin/users/block/${id}`,httpOptions)
  }

 


}
