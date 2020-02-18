import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { Attributes } from 'app/feature/sale-order/sale-order.service';

interface FormEntityWithAttribute {
  attributes: { [key: number]: any };
}
@Injectable({
  providedIn: 'root'
})
export class AttributesFormBuilderService<T extends FormEntityWithAttribute> {

  constructor(public translateService: TranslateService) { }

  public addTranslationForAttribute(attribute: Attributes): void {
    const transsObj = {};
    transsObj[attribute.name] = attribute.translations[2];
    this.translateService.setTranslation('en', transsObj, true);
    transsObj[attribute.name] = attribute.translations[1];
    this.translateService.setTranslation('he', transsObj, true);
  }

  public addFormControlFromAttribute(
    attribute: Attributes, formEntity: T, 
    form: FormGroup, required = true, disabled = false): void {

    const control = new FormControl(formEntity.attributes[attribute.id]);
    control.setValue(formEntity.attributes[attribute.id]);
    
    if (required) {
      control.validator = Validators.required;
    }

    if (attribute.editable) {
      control.enable();
    }
    
    form.addControl(attribute.name, control);
  }
}
