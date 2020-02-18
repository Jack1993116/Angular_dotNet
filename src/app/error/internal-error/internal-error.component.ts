import { Component, ViewEncapsulation } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


@Component({
  selector: 'app-internal-error',
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InternalErrorComponent {

  constructor() {}

}
