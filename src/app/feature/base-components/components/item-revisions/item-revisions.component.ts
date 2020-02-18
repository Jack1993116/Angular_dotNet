import { Component, OnInit, Input } from '@angular/core';

import { ItemRevision } from 'app/feature/item-master-data/tabs/item-revision/ItemRevision';
import { ItemRevisionService } from 'app/feature/item-master-data/tabs/item-revision/item-revision.service';
import { ControlContainer, FormGroupName, FormGroup } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subject, merge } from 'rxjs';
import { EntityApi } from 'app/shared/interfaces';

@Component({
  selector: 'app-item-revisions',
  templateUrl: './item-revisions.component.html',
  styleUrls: ['./item-revisions.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]
})
export class ItemRevisionsComponent implements OnInit {
 
  @Input()
  form: FormGroup;
  itemRevisionsSubject = new Subject<ItemRevision[]>();
  itemRevisions$ = this.itemRevisionsSubject.asObservable();
  itemRevisions: ItemRevision[] = [];
  isItemRevisionsFromService = false;

  constructor(private itemRevisionService: ItemRevisionService) { }

  ngOnInit(): void {
    this.itemRevisionsSubject
      .subscribe(data => this.itemRevisions = data);

    if (this.form.controls['revisionCode'].value) {
      setTimeout(() => { 
        this.itemRevisionsSubject.next([Object.assign(new ItemRevision(), {
          revisionCode: this.form.controls['revisionCode'].value
        })]);
      }, 10);
    }

    this.form.controls['itemID'].valueChanges
    .pipe(
      switchMap((term: number) => {
        if (term) {
          return this.getFromService(term);
        } else {
          return EMPTY;
        }
      }
    ))
    .subscribe(this.emitNewValue());
  
    merge(this.form.controls['logisticSiteCode'].valueChanges,
      this.form.controls['itemID'].valueChanges)
      .pipe(
        startWith(this.form.controls['logisticSiteCode'].value))
        .subscribe(this.checkEnableFormControl);
  }

  private emitNewValue(): (value: EntityApi<ItemRevision>) => void {
    return data => {
      if (data) {
        this.itemRevisionsSubject.next(data.items);
      }
    };
  }

  getRevisionsFromServiceIfNeeded(): void {
    if (!this.isItemRevisionsFromService) {
      this.getFromService(this.form.controls['itemID'].value)
      .subscribe(this.emitNewValue());
    }
  }

  // ngOnInit(): void {
  //   this.checkEnableFormControl();

  //   if (this.form.controls['itemID'].value) {
  //     this.getFromService(this.form.controls['itemID'].value)
  //       .subscribe(data => 
  //         this.getData(data))
  //   }
    
  //   this.form.controls['itemID'].valueChanges
  //   .pipe(
  //     switchMap((term: number) => {
  //       this.checkEnableFormControl();
  //       return this.getFromService(term);
  //     }
  //   ))
  //   .subscribe(data => {
  //     if (data) {
  //       this.getData(data)
  //     }
  //   });
  // }

  private checkEnableFormControl(): void {
    // TODO: check if condistion is needed
    if (this.form) {
      if (this.form.controls['itemID'].value &&
        this.form.controls['itemCode'].enabled) {
        this.form.controls['revisionCode'].enable();
      }
      else {
        this.form.controls['revisionCode'].disable();
      }
    }
  }

  private getFromService(term: number): Observable<EntityApi<ItemRevision>> {
    this.isItemRevisionsFromService = true;
    return this.itemRevisionService
      .getItemRevisionByItemId(term);
  }

  private getData(data: EntityApi<ItemRevision>): void {
    if (data) {
      this.itemRevisions = data.items;
    }
  }

}
