import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tasks } from './tasks';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService} from './messages.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HttpService{
  hostName: string = location.hostname;
  url: string = `http://${this.hostName}:3000/tasks`;
  headers: HttpHeaders = new HttpHeaders()
  .set("Content-Type",  "application/json");

  constructor(
    private http: HttpClient,
    private messageService: MessageService){
    console.log(this.hostName);
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getData(){
    return this.http.get(this.url)
  }

  getDataById(id) {
    return this.http.get(this.url + '/' + id)
  }

  postData(tasks: Tasks): Observable<Tasks>{

    const body = this.stringify(tasks);
    return this.http.post<Tasks>(this.url, body, httpOptions)
      .pipe(
      tap((tasks: Tasks) => this.log(`added task w/ id=${tasks.id}`)),
      catchError(this.handleError<Tasks>('addTask'))
    );
  }

  putData(tasks: Tasks, id: number): Observable<Tasks>{

    const body = this.stringify(tasks);
    return this.http.put<Tasks>(this.url + '/' + id, body, httpOptions)
      .pipe(
        tap((tasks: Tasks) => this.log(`edited task w/ id=${tasks.id}`)),
        catchError(this.handleError<Tasks>('editTask'))
      );
  }

  deleteData(id: number) {
    return this.http.delete<Tasks>(this.url + '/' + id)
      .pipe(
        tap((tasks: Tasks) => this.log(`deleted task w/ id=${id}`)),
        catchError(this.handleError<Tasks>('deleteTask'))
      );
  }

  stringify(object) {
    return JSON.stringify({description: object.description})
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
