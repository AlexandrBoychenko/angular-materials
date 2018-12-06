import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Tasks } from './tasks';

@Injectable()
export class HttpService{
  url: string = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient){}

  getData(){
    return this.http.get(this.url)
  }

  postData(tasks: Tasks){

    const body = JSON.stringify({description: tasks.description, date: tasks.date});
    console.log(body);
    return this.http.post(this.url, body);
  }
}
