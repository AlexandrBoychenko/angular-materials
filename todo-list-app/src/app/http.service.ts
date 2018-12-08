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
  url: string = 'http://localhost:3000/tasks';

  constructor(
    private http: HttpClient,
    private messageService: MessageService){}

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getData(){
    return this.http.get(this.url)
  }

  postData(tasks: Tasks): Observable<Tasks>{
    const headers = new HttpHeaders()
      .set("Content-Type",  "application/json");

    const body = JSON.stringify({description: tasks.description, date: tasks.date});
    return this.http.post<Tasks>(this.url, body, {headers})
      .pipe(
      tap((tasks: Tasks) => this.log(`added hero w/ id=${tasks.id}`)),
      catchError(this.handleError<Tasks>('addHero'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
