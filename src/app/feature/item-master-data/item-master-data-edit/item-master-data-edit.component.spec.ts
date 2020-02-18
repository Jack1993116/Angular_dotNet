import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterDataEditComponent } from './item-master-data-edit.component';

describe('ItemMasterDataEditComponent', () => {
  let component: ItemMasterDataEditComponent;
  let fixture: ComponentFixture<ItemMasterDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMasterDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMasterDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
