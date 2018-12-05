import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService{
  url = 'http://127.0.0.1:3000/tasks';

  constructor(private http: HttpClient){}

  getData(){
    return this.http.get(this.url)
  }
}
