import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddOrderComponent implements OnInit {
  
    @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  emitClicked() {
    this.clicked.next();
  }
}
