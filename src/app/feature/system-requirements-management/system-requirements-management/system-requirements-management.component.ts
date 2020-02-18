import { Component, ViewEncapsulation } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as hebrew } from '../i18n/he';
import { BaseParent } from 'app/feature/base-components/classes/base-parent';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';

@Component({
  selector: 'app-system-requirements-management',
  templateUrl: './system-requirements-management.component.html',
  styleUrls: ['./system-requirements-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemRequirementsManagementComponent extends BaseParent {

  constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
              public unitOfMeasureService: UnitOfMeasureService) { 
    super(unitOfMeasureService);
    this.fuseTranslationLoaderService.loadTranslations(english, hebrew);
  }

}
