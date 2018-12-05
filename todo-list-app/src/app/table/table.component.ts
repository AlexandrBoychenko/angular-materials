import { Component, OnInit} from '@angular/core';
import { HttpService } from '../http.service';
import { Tasks } from '../tasks';

export interface PeriodicElement {
  id: number;
  description: string;
  date: number;
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

  tasks: Tasks;

  constructor(private httpService: HttpService){
    this.getElementData().then((elementsData: []) => {
      this.dataSource = elementsData
    });
  }

  dataSource: [];

  displayedColumns: string[] = ['id', 'description', 'date'];



  ngOnInit(){
    console.log(this.dataSource);

  }

  getElementData() {
    return new Promise((res, rej) => {
      this.httpService.getData().subscribe((data: []) => {
        data.forEach((item: Tasks) => {

          this.tasks = item;
          ELEMENT_DATA.push(this.tasks);
        });
        res(ELEMENT_DATA)
      });
    })
  }



}
