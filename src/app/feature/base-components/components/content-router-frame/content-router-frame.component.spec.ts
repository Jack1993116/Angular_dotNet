import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRouterFrameComponent } from './content-router-frame.component';

describe('ContentRouterFrameComponent', () => {
  let component: ContentRouterFrameComponent;
  let fixture: ComponentFixture<ContentRouterFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRouterFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRouterFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
