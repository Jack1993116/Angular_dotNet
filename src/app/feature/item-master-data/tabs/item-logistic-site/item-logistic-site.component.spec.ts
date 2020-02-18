import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLogisticSiteComponent } from './item-logistic-site.component';

describe('ItemLogisticSiteComponent', () => {
  let component: ItemLogisticSiteComponent;
  let fixture: ComponentFixture<ItemLogisticSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemLogisticSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLogisticSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
