import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatSnackBar } from '@angular/material';
import { trigger, style, state } from '@angular/animations';


import {Tasks} from '../tasks';

export interface PeriodicElement {
  id: number;
  description: string;
  date: string;
  action: void
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'main',
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
  providers: [HttpService],
  animations: [
    trigger("animationTrigger", [
      state('invisible', style({
        left: '-39%',
        transition: '1s'
      })),
      state('moveOut', style({
        left: '0',
        transition: '1s'
      }))
    ])
  ]
})

export class MainComponent implements OnInit {
  tasks: Tasks = new Tasks();
  dataSource: Tasks[];

  hideSpinner: boolean = true;
  hideStart: boolean = true;
  hideMain: boolean = true;
  sideBarStatus: boolean = false;

  hideStartNote: boolean;
  hideLoadNote: boolean;
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
    this.changeSpinnerNote(false, true);

    this.httpService.getData().subscribe((data: []) => {
      if (data.length) {
        this.changeStartView(true, false);

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
        this.changeStartView(false, true);
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

  sideBarOpen(): void {
    this.sideBarStatus = true;
  }

  sideBarClose(): void {
    this.sideBarStatus = false;
    this.tasks.description = '';
  }

  addTask(tasks: Tasks): void {
    this.changeSideBarAndSpinner(false, false);
    this.changeSpinnerNote(true, false);

    if (!this.checkExclaim('!')) {
      this.handleAddTask(tasks);
    } else {
      this.handleExclaimError();
    }
    this.changeStartView(true, false);
    this.tasks.description = '';
  }

  handleAddTask(tasks): void {
    this.sideBarOpen();
    this.httpService.postData(tasks)
      .subscribe(
        (data: Tasks) => {
          this.addElementById(data.id);
          this.changeSideBarAndSpinner(false, true);
        },
        error => this.snackBar.open(error, 'Закрыть')
      );
  }

  handleExclaimError() {
    this.snackBar.open('Ошибка! Текст содержит символ "!"', 'Закрыть');
    this.sideBarStatus = false;

    setTimeout(() => {
      this.changeSideBarAndSpinner(true, true);
    }, 1000);
  }

  checkExclaim(exclaim): number {
    return ~this.tasks.description.indexOf(exclaim);
  }

  changeStartView(start: boolean, main: boolean): void {
    this.hideStart = start;
    this.hideMain = main;
  }

  changeSideBarAndSpinner(sidebar: boolean, spinner: boolean): void {
    this.sideBarStatus = sidebar;
    this.hideSpinner = spinner;
  }

  changeSpinnerNote(startNote: boolean, loadNote: boolean): void {
    this.hideStartNote = startNote;
    this.hideLoadNote = loadNote;
  }

  deleteTask(currentId): void {
    this.hideSpinner = false;
    this.changeSpinnerNote(false, true);

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
    return currentDate.toString().slice(0,24);
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
    this.changeSpinnerNote(false, true);

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
