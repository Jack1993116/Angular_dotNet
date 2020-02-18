import { Component, OnInit, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable, EMPTY, merge, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap, startWith } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material';
import { FormGroup, ControlContainer, FormGroupName } from '@angular/forms';

import { ItemUnitOfMeasureService } from 'app/core/services/item-unit-of-measure/item-unit-of-measure.service';
import { ItemUnitOfMeasure } from 'app/core/services/item-unit-of-measure/ItemUnitOfMeasure';
import { EntityApi } from 'app/shared/interfaces';

@Component({
  selector: 'app-units-form-field',
  templateUrl: './units-form-field.component.html',
  styleUrls: ['./units-form-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
  encapsulation: ViewEncapsulation.None,
})
export class UnitsFormFieldComponent 
  implements OnInit {

  @Input()
  form: FormGroup;

  unitsSubject = new Subject<ItemUnitOfMeasure[]>();
  units$ = this.unitsSubject.asObservable();
  units: ItemUnitOfMeasure[]; 
  isUnitsFromService = false;

  constructor(private itemUnitOfMeasureService: ItemUnitOfMeasureService) { }

  ngOnInit(): void {
    this.unitsSubject.subscribe(data => this.units = data);
    if (this.form.controls['itemID'].value) {
      setTimeout(() => {
        this.unitsSubject.next([Object.assign(new ItemUnitOfMeasure(), {
          unitCode: this.form.controls['unitCode'].value
        })]);
      }, 10);
    }

    this.form.controls['itemID'].valueChanges
      .pipe(
        switchMap((term: number) => {
          if (term) {
            return this.getUnitsFromService(term);
          } else {
            return EMPTY;
          }
        }))
        .subscribe(this.emitNewValue());

    merge(this.form.controls['logisticSiteCode'].valueChanges,
      this.form.controls['itemID'].valueChanges)
      .pipe(
        debounceTime(50),
        startWith(this.form.controls['logisticSiteCode'].value))
        .subscribe(() => {
          if (this.form.controls['logisticSiteCode'].value &&
              this.form.controls['logisticSiteCode'].enabled &&
              this.form.controls['itemID'].value) {
            this.form.controls['unitCode'].enable();
          } else {
            this.form.controls['unitCode'].disable();
          }
      });
  }

  getUnitsFromServiceIfNeeded(): void {
    if (!this.isUnitsFromService) {
      this.getUnitsFromService(this.form.controls['itemID'].value)
      .subscribe(this.emitNewValue());
    }
  }

  private getUnitsFromService(term: number): Observable<EntityApi<ItemUnitOfMeasure>> {
    this.isUnitsFromService = true;
    return this.itemUnitOfMeasureService
      .getById(term,
        this.form.controls['logisticSiteCode'].value); 
  }

  private emitNewValue(): (value: EntityApi<ItemUnitOfMeasure>) => void {
    return data => {
      if (data) {
        this.unitsSubject.next(data.items);
      }
    };
  }
  
  unitSelectionChange(event: MatSelectChange): void {
      if (Object.keys(this.form.controls).indexOf('shipItemUnitID') > 0) {
        const valueSelected = this.units.filter(unit => 
            unit.unitCode === event.value)[0];
        this.form.controls['unitCode'].setValue(valueSelected.unitCode);
        this.form.controls['shipItemUnitID'].setValue(valueSelected.itemUnitID);
      }
    }
}
