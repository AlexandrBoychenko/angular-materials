import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Закрыть');
  }

  ngOnInit() {
    this.openSnackBar("Ошибка, в тексте присутствует восклицательный знак!");
    document.querySelector('snack-bar-container').setAttribute("style", "display:none");
  }
}
