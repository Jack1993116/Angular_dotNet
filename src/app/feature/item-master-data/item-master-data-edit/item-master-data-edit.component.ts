import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ItemMasterData } from '../ItemMasterData';
import { ItemMasterDataService } from '../item-master-data.service';



@Component({
  selector: 'app-item-master-data-edit',
  templateUrl: './item-master-data-edit.component.html',
  styleUrls: ['./item-master-data-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemMasterDataEditComponent 
  extends BaseEditCreate<ItemMasterData, ItemMasterDataService> 
  implements OnInit {

  constructor(public itemService: ItemMasterDataService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) {
      super(itemService,
        router, route, snacBar, translateService,
        'IMD_EDIT',
        '/item-master-data');
     }

  ngOnInit(): void {
    this.getEntity();
  }

  save(event: ItemMasterData): void {
    super.save(event,
      'IMD_EDITED', 'itemID', 'edit',
      null, null );
  }

}
