import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-content-router-frame',
  templateUrl: './content-router-frame.component.html',
  styleUrls: ['./content-router-frame.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentRouterFrameComponent {

  @Input()
  title: string;
  @Input()
  icon: string;
  @Output()
  created = new EventEmitter<any>();
  @Output()
  destoryed = new EventEmitter<any>();

  constructor() { }
  
  componentAdded(event: any): void {
    this.created.next(event);
  }

  componentRemoved(event: any): void {
    this.destoryed.next(event);
  }

}
