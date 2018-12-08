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

  tasksTest: string[] = ['стабильный'];

  dataSource: Tasks[];

  constructor(private httpService: HttpService){}

  displayedColumns: string[] = ['id', 'description', 'date', 'actions'];

  ngOnInit(){
    this.getElementData();
  }

  getElementData(): void{
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
        this.dataSource = ELEMENT_DATA;
      });
  }
}
