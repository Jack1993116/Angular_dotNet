import { Component, OnInit, Input, ViewEncapsulation, 
  Output, EventEmitter } from '@angular/core';
import { ColumnsModel } from './columns-model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-grid-columns-picker',
  templateUrl: './grid-columns-picker.component.html',
  styleUrls: ['./grid-columns-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridColumnsPickerComponent implements OnInit {
  
  @Input()
  columnsList: ColumnsModel[];
  @Input()
  cookieName: string;

  @Output() columnName = new EventEmitter<string>();

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    if (this.cookieService.check(this.cookieName)){
      const tempCol = JSON.parse(this.cookieService.get(this.cookieName));
      tempCol.forEach(element => {
        if (!element.checked) {
          this.columnsList.filter(clm => clm.name === element.name)[0].checked = false;
          this.columnName.next(element.name);
        }
      });
    }
  }

  changeColumn(column: ColumnsModel): void {
    this.columnName.next(column.name);
    column.checked = false;
    this.cookieService.set(this.cookieName,
      JSON.stringify(this.columnsList));
  }

}
