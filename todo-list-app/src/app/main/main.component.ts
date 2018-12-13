import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material';


import {Tasks} from '../tasks';

export interface PeriodicElement {
  id: number;
  description: string;
  date: string;
  action: void
}

const ELEMENT_DATA: PeriodicElement[] = [];

/**
 * @title Basic use of `<main mat-main>`
 */
@Component({
  selector: 'main',
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
  providers: [HttpService]
})

export class MainComponent implements OnInit {
  tasks: Tasks = new Tasks(); // данные вводимого пользователя

  visibility: boolean = true;
  spinnerView: boolean;
  editVisibility: boolean;
  dialogRef: any;
  currentId: number;

  dataSource: Tasks[];

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {}

  displayedColumns: string[] = ['id', 'description', 'date', 'actions'];

  ngOnInit() {
    this.getElementData();
    this.spinnerView = true;
  }

  getElementData(): any {
    this.httpService.getData().subscribe((data: []) => {
      data.forEach((item: Tasks) => {

        let stringDate = this.getDate(item);

        let {id, description} = item;

        this.tasks = {
          id: id,
          description: description,
          date: stringDate,
          action: undefined
        };
        ELEMENT_DATA.unshift(this.tasks);
      });

      this.tasks = {
        id: undefined,
        description: undefined,
        date: undefined,
        action: undefined
      };
      this.dataSource = ELEMENT_DATA;
    });
  }

  addElementById(id): any {
    this.httpService.getDataById(id).subscribe((data: Tasks) => {

      let stringDate = this.getDate(data);

      let {id, description} = data;

      let taskObject = {
        id: id,
        description: description,
        date: stringDate,
        action: undefined
      };

      this.dataSource.unshift(taskObject);
      this.dataSource = [...this.dataSource];
    });
  }

  onOpen(): void {
    this.visibility = false;
  }

  onClose(): void {
    this.visibility = true;
  }

  submit(tasks: Tasks): void {
    this.spinnerView = false;
    this.visibility = false;

    if (!this.checkExclaim('!')) {
      this.httpService.postData(tasks)
        .subscribe(
          (data: Tasks) => {
            this.addElementById(data.id);
            this.spinnerView = true;
            this.visibility = true;
          },
          error => console.log(error)
        );
    }
  }

  checkExclaim(exclaim): boolean {
    if (~this.tasks.description.indexOf(exclaim)) {
      this.snackBar.open('Ошибка! Текст содержит символ "!"', 'Закрыть');
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
        this.spinnerView = true;
      }, 1000);
      document.querySelector('snack-bar-container').setAttribute("style", "display:block");
      return true;
    } else {
      this.onClose();
      return false;
    }
  }

  deleteElement(event): void {
    this.currentId = this.getTaskFromHTML(event).id;

    this.httpService.deleteData(this.currentId)
      .subscribe(
        answer => this.removeById(this.currentId),
        error => console.log(error)
      );
  }

  getDate(data): string {
    let currentDate = new Date(data['date']);
    return currentDate.toDateString() + ' time: ' + currentDate.getUTCHours() + ':'
      + currentDate.getUTCMinutes() + ':' + currentDate.getUTCSeconds();
  }

  onMouseEnter(event): void {
    event.target.querySelector('.create-icon').setAttribute('style', 'display:inline-block');
    this.editVisibility = true;
  }

  onMouseLeave(event): void {
    event.target.querySelector('.create-icon').setAttribute('style', 'display:none');
    this.editVisibility = false;
  }

  openDialog(event): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.getTaskFromHTML(event);

    this.dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.modifyAfterClosed(dialogConfig.data.id);
  }

  modifyAfterClosed(objectId): void {
    this.dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        this.dialogRef.close();

        if (data) {
          this.updateTask(data, objectId);
        }
      }
    );
  }

  updateTask(formData, objectId): void {
    this.spinnerView = false;

    this.httpService.putData(formData, objectId)
      .subscribe(
        (data: Tasks) => {
          this.replaceById(data);
          this.spinnerView = true;
        },
        error => console.log(error)
      );
  }

  replaceById(data: Tasks): void {
    this.dataSource.forEach((element) => {
      if (element.id === data.id) {
        element.description = data.description;
      }
    });
    this.dataSource = [...this.dataSource];
  }

  removeById(id): void {
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i]['id'] == id) {
        this.dataSource.splice(i, 1);
        this.dataSource = [...this.dataSource];
        return
      }
    }
  }

  getTaskFromHTML(event) {
    return {
      id: event.target.attributes.id.value,
      description: event.currentTarget.parentNode.childNodes[0].nodeValue
    }
  }
}
