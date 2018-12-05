import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-list-app';

  onOpen() {
    document.querySelector('mat-sidenav-container').classList.remove('invisible');
  }
}
