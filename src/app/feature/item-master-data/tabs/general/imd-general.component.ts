import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ItemMasterData } from '../../ItemMasterData';
import { Constants } from 'app/constants';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';
import { UnitOfMeasure } from 'app/core/services/unit-of-measure/UnitOfMeasure';

@Component({
  selector: 'app-imd-general',
  templateUrl: './imd-general.component.html',
  styleUrls: ['./imd-general.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IMDGeneralComponent implements OnInit {

  @Input() 
  item: ItemMasterData;
  @Input()
  form: FormGroup;
  groupCode: any[];
  itemType: any[];
  unitOfMeasure: UnitOfMeasure[];

  constructor(unitOfMeasureService: UnitOfMeasureService) {
    this.groupCode = Constants.groupCode.slice(0);
    this.itemType = Constants.itemType.slice(0);
    // this.unitOfMeasure = unitOfMeasureService.
    //   getUnitOfMeasure().slice(0);
   }

  ngOnInit(): void {
    
  }

}
