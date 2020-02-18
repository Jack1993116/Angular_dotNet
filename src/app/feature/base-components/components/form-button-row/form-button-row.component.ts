import { Component, ViewEncapsulation, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as hebrew } from '../i18n/he';

@Component({
  selector: 'app-form-button-row',
  templateUrl: './form-button-row.component.html',
  styleUrls: ['./form-button-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormButtonRowComponent {

  @Input() form: FormGroup;
  @Input() plugButtonTxt: string;
  @Output() saved = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Output() newLine = new EventEmitter<any>();
  @Output() plugButtonClick = new EventEmitter<any>();


  constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService) { 
    this.fuseTranslationLoaderService.loadTranslations(english, hebrew);
  }

  goBack(): void {
    this.back.next();
  }

  save(): void {
    this.saved.next();
  }

  addLine(): void {
    this.newLine.next();
  }

  plugButtonAction(): void {
    this.plugButtonClick.next();
  }

}
