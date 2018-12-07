import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tasks } from './tasks';

@Injectable()
export class HttpService{
  url: string = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient){}

  getData(){
    return this.http.get(this.url)
  }

  postData(tasks: Tasks){
    const headers = new HttpHeaders()
      .set("Content-Type",  "application/json");

    const body = JSON.stringify({description: tasks.description, date: tasks.date});
    return this.http.post(this.url, body, {headers});
  }
}
