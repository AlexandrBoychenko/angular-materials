import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {HttpService} from '../http.service';
import {Tasks} from '../tasks';

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
  tasks: Tasks = new Tasks(); // данные вводимого пользователя

  invisile: boolean;
  date: object;

  dataSource: Tasks[];

  constructor(private httpService: HttpService, private changeDetectorRef: ChangeDetectorRef) {
  }

  displayedColumns: string[] = ['id', 'description', 'date', 'actions'];

  ngOnInit() {
    this.getElementData();
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
        ELEMENT_DATA.push(this.tasks);
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

      this.dataSource.push(taskObject);
      this.dataSource = [...this.dataSource];
    });
  }

  onClose() {
    document.querySelector('mat-sidenav-container').classList.add('visibility');
    this.invisile = true;
  }

  submit(tasks: Tasks) {

    this.httpService.postData(tasks)
      .subscribe(
        (data: Tasks) => {
          this.addElementById(data.id);
        },
        error => console.log(error)
      )
  }

  getDate(data): string {
    let currentDate = new Date(data['date']);
    return currentDate.toDateString() + ' time: ' + currentDate.getUTCHours() + ':'
      + currentDate.getUTCMinutes() + ':' + currentDate.getUTCSeconds();
  }
}
