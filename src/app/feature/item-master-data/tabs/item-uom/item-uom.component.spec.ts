import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUOMComponent } from './item-uom.component';

describe('ItemUOMComponent', () => {
  let component: ItemUOMComponent;
  let fixture: ComponentFixture<ItemUOMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUOMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
