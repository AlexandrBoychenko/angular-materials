import { Component, OnInit} from '@angular/core';
import { HttpService } from '../http.service';
import { Tasks } from '../tasks';
import { TasksDate } from '../tasksDate';

export interface PeriodicElement {
  id: number;
  description: string;
  date: string;
  action: void
}

const ELEMENT_DATA: PeriodicElement[] = [];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic',
  styleUrls: ['table.component.scss'],
  templateUrl: 'table.component.html',
  providers: [HttpService]
})
export class TableComponent implements OnInit {

  tasks: TasksDate;

  constructor(private httpService: HttpService){
    this.getElementData().then((elementsData: []) => {
      this.dataSource = elementsData
    });
  }

  dataSource: [];

  displayedColumns: string[] = ['id', 'description', 'date', 'actions'];

  ngOnInit(){}

  getElementData() {
    return new Promise((res, rej) => {
      this.httpService.getData().subscribe((data: []) => {
        data.forEach((item: Tasks) => {

          let stringDate: string = new Date(item['date'].toString()).toDateString();

          let {id, description} = item;

          this.tasks = {
            id: id,
            description: description,
            date: stringDate,
            action: undefined
          };

          ELEMENT_DATA.push(this.tasks);
        });
        res(ELEMENT_DATA)
      });
    })
  }



}
