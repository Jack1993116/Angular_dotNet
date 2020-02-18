import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HorizontalLayout1Module } from './horizontal/layout-1/layout-1.module';
import { VerticalLayout1Module } from './vertical/layout-1/layout-1.module';

@NgModule({
    imports: [
        TranslateModule,
        HorizontalLayout1Module,
        VerticalLayout1Module
    ],
    exports: [
        HorizontalLayout1Module,
        VerticalLayout1Module
    ]
})
export class LayoutModule
{
}
