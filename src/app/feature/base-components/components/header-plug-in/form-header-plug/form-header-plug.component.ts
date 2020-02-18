import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-header-plug',
  templateUrl: './form-header-plug.component.html',
  styleUrls: ['./form-header-plug.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormHeaderPlugComponent implements OnInit {

  @Input()
  entity: any;
  @Input() 
  form: FormGroup;
  @Input()
  showUpload: boolean;
  @Input()
  showReport: boolean;
  @Output()
  newFile = new EventEmitter<File>();

  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    const file = files.item(0);
    this.newFile.next(file);
  }

}
