import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { TranslateModule } from '@ngx-translate/core';

import { FuseSearchBarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { FuseShortcutsModule } from '../shortcuts/shortcuts.module';
@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatMenuModule,
        MatToolbarModule,
        TranslateModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
