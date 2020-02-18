import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterDataComponent } from './item-master-data.component';

describe('ItemMasterDataComponent', () => {
  let component: ItemMasterDataComponent;
  let fixture: ComponentFixture<ItemMasterDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMasterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
