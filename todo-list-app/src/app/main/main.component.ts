import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmComponent } from '../confirm/confirm.component';
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
  tasks: Tasks = new Tasks();
  dataSource: Tasks[];

  hideSideBar: boolean = true;
  hideSpinner: boolean = true;
  hideStart: boolean = false;
  hideMain: boolean = true;
  dialogRef: any;

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  displayedColumns: string[] = ['id', 'description', 'date', 'actions'];

  ngOnInit() {
    this.getElementData();
  }

  getElementData(): any {
    this.hideSpinner = false;
    this.httpService.getData().subscribe((data: []) => {
      if (data.length) {
        this.hideStart = true;
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
      } else {
        this.hideMain = true;
      }

      this.hideSpinner = true;

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
    this.hideSideBar = false;
  }

  onClose(): void {
    this.hideSideBar = true;
  }

  addTask(tasks: Tasks): void {
    this.changeSideBarAndSpinner(false, false);

    if (!this.checkExclaim('!')) {
      this.handleAddTask(tasks);
    } else {
      this.handleExclaimError();
    }
  }

  handleAddTask(tasks): void {
    this.onClose();
    this.httpService.postData(tasks)
      .subscribe(
        (data: Tasks) => {
          this.addElementById(data.id);
          this.changeSideBarAndSpinner(true, true);
        },
        error => this.snackBar.open(error, 'Закрыть')
      );
  }

  handleExclaimError() {
    this.snackBar.open('Ошибка! Текст содержит символ "!"', 'Закрыть');
    this.hideSideBar = true;

    setTimeout(() => {
      this.changeSideBarAndSpinner(false, true);
    }, 1000);
  }

  checkExclaim(exclaim): number {
    return ~this.tasks.description.indexOf(exclaim);
  }

  changeSideBarAndSpinner(sidebar: boolean, spinner: boolean): void {
    this.hideSideBar = sidebar;
    this.hideSpinner = spinner;
  }

  deleteTask(currentId): void {
    this.hideSpinner = false;
    this.httpService.deleteData(currentId)
      .subscribe(
        () => {
          this.removeById(currentId);
          this.hideSpinner = true;
        },
        error => this.snackBar.open(error, 'Закрыть')
      )
  }

  getDate(data): string {
    let currentDate = new Date(data['date']);
    return currentDate.toDateString() + ' time: ' + currentDate.getHours() + ':'
      + currentDate.getMinutes() + ':' + currentDate.getSeconds();
  }

  openDialog(): void {
    const currentDialogConfig = this.createDialog(DialogComponent, 'dialog-window');
    this.modifyAfterClosed(currentDialogConfig.data.id);
  }

  openConfirmDialog(): void {
    const currentDialogConfig = this.createDialog(ConfirmComponent, 'confirm-window');
    this.deleteAfterClosed(currentDialogConfig.data.id);
  }

  createDialog(DialogComponent, className): any {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.getTaskFromHTML(event);
    dialogConfig.panelClass = className;

    this.dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    return dialogConfig;
  }

  modifyAfterClosed(objectId): void {
    this.dialogRef.afterClosed().subscribe(
      data => {
        this.dialogRef.close();
        if (data) {
          this.updateTask(data, objectId);
        }
      }
    );
  }

  deleteAfterClosed(objectId): void {
    this.dialogRef.afterClosed().subscribe(
      (data) => {
        this.dialogRef.close();
        if(data === "delete") {
          this.deleteTask(objectId);
        }
      }
    );
  }

  updateTask(formData, objectId): void {
    this.hideSpinner = false;

    this.httpService.putData(formData, objectId)
      .subscribe(
        (data: Tasks) => {
          this.replaceById(data);
          this.hideSpinner = true;
        },
        error => this.snackBar.open(error, 'Закрыть')
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
      description: event.currentTarget.parentNode.firstChild.data
    }
  }
}
