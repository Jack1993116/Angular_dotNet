import { Component, ViewEncapsulation } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as hebrew } from '../i18n/he';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {

    constructor(private transLoaderService: FuseTranslationLoaderService){
        this.transLoaderService.loadTranslations(english, hebrew);
        
    }
}
