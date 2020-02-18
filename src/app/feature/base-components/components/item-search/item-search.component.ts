import { Component, OnInit, OnDestroy, Input, 
  AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroupName, ControlContainer, FormGroup } from '@angular/forms';

import { MatAutocompleteSelectedEvent, 
  MatAutocompleteTrigger} from '@angular/material';
import { Observable, Subject, merge, Subscription, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { ItemMasterData } from 'app/feature/item-master-data/ItemMasterData';
import { ItemMasterDataService } from 'app/feature/item-master-data/item-master-data.service';
import { SaleOrderLines } from 'app/feature/sale-order/SaleOrder';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
  encapsulation: ViewEncapsulation.None
})
export class ItemSearchComponent 
  implements OnInit, AfterViewInit, OnDestroy {
  
  @Input()
  form: FormGroup;
  @Input()
  line: SaleOrderLines;
  public searchTermItems = new Subject<string>();
  itemsSubject = new Subject<ItemMasterData[]>();
  public items$ = this.itemsSubject.asObservable();
  items: ItemMasterData[];

  subscription: Subscription;
  
  @ViewChild(MatAutocompleteTrigger, { static: false }) 
    trigger: MatAutocompleteTrigger;
    
  constructor(private itemMasterDataService: ItemMasterDataService) { }

  ngOnInit(): void {
    this.setItemsObservabule();
  } 

  private setItemsObservabule(): void {
    this.itemsSubject.subscribe(data => this.items = data);

    if (this.form.controls['itemID'].value) {
      setTimeout(() => {
        this.itemsSubject.next([Object.assign(new ItemMasterData(), {
          itemID: this.form.controls['itemID'].value,
          itemCode: this.form.controls['itemCode'].value,
          itemName: this.form.controls['itemName'].value,
          frgnName: this.form.controls['frgnName'].value
        })]);
      }, 10);
    }

    merge(this.form.controls['itemCode'].valueChanges,
      this.form.controls['itemName'].valueChanges,
      this.form.controls['frgnName'].valueChanges)
      .pipe(
        debounceTime(50), 
        distinctUntilChanged(), 
        switchMap((term: string) => {
          return this.itemMasterDataService.searchItems(term,
            true, false);
        })).subscribe(data => {
          if (data) {
            this.itemsSubject.next(data);
          }
        });

    this.form.controls['logisticSiteCode'].valueChanges
      .pipe(
        debounceTime(50), 
        distinctUntilChanged())
        .subscribe(data => { 
          if (this.form.controls['logisticSiteCode'].enabled &&
            this.form.controls['logisticSiteCode'].value) {
              this.form.controls['itemCode'].enable();
              this.form.controls['itemName'].enable();
              this.form.controls['frgnName'].enable();
          } else {
            this.form.controls['itemCode'].disable();
            this.form.controls['itemName'].disable();
            this.form.controls['frgnName'].disable();
          }
      });
  }

  // private setItemsObservabule(): void {
  //   this.items$ = merge(this.form.controls['itemCode'].valueChanges,
  //     this.form.controls['itemName'].valueChanges,
  //     this.form.controls['frgnName'].valueChanges)
  //     .pipe(
  //       debounceTime(50), 
  //       distinctUntilChanged(), 
  //       switchMap((term: string) => {
  //         return this.itemMasterDataService.searchItems(term);
  //       }),
  //       tap(data => {
  //         this.items = data;
  //       }));  
  // }

  ngAfterViewInit(): void {
    this._subscribeToClosingActions();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (this.items && this.items.length === 1) {
          const item = this.items[0]; 
          this.setItemVal(item.itemID, item.itemCode, 
            item.itemName, item.frgnName);
        } else if (!this.form.pristine) {
            if (!e || !e.source) {
              this.setItemVal(null, null, null, null);
            }
        }
      },
      () => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  selectItem(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as ItemMasterData;
    this.setItemVal(item.itemID, item.itemCode, 
      item.itemName, item.frgnName);
    this.form.controls['unitCode'].setValue('');
    this.line.unitCodes = [];
  }

  setItemVal(itemID: number, itemCode: string,
             itemName: string, frgnName: string): void {
    this.form.controls['itemID'].setValue(itemID);
    this.form.controls['itemCode'].setValue(itemCode);
    this.form.controls['itemName'].setValue(itemName);
    this.form.controls['frgnName'].setValue(frgnName);
  }

}
