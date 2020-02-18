import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, 
  MatCheckboxModule, MatChipsModule,
  MatDatepickerModule, MatDialogModule,
  MatFormFieldModule, MatIconModule , MatInputModule, 
  MatPaginatorModule, MatProgressSpinnerModule, 
  MatSelectModule, MatSnackBarModule, MatSortModule, 
  MatTableModule, MatTabsModule, MatToolbarModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';

// See the users guides and how to use:
// https://github.com/FortAwesome/angular-fontawesome/blob/be99071851eea2c6d3211b9c3de38aca44a5b624/docs/usage.md
// See icons:
// https://fontawesome.com/icons?d=gallery&m=free
import { FontAwesomeModule, FaIconLibrary  } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare, faCoffee, faFileExcel, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';


import { GridColumnsPickerComponent } from './components/grid-columns-picker/grid-columns-picker.component';
import { DialogDeleteConfirmtionComponent } from './components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';
import { HeaderComponent } from './components/header/header.component';
import { ProjectPipe } from './pipes/project.pipe';
import { DocStatusPipe } from './pipes/doc-status.pipe';
import { LinesDialogComponent } from './components/lines-dialog/lines-dialog.component';
import { ObjectsPipe } from './pipes/objects.pipe';
import { ErpsPipe } from './pipes/erps.pipe';
import { UnitsPipe } from './pipes/units.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';
import { SizePipe } from './pipes/size.pipe';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { CustomePaginatorComponent } from './components/custome-paginator/custome-paginator.component';


@NgModule({
  declarations: [
    GridColumnsPickerComponent,
    DialogDeleteConfirmtionComponent,
    HeaderComponent,
    ProjectPipe,
    DocStatusPipe,
    LinesDialogComponent,
    ObjectsPipe,
    ErpsPipe,
    UnitsPipe,
    CurrencyPipe,
    SizePipe,
    AddOrderComponent,
    CustomePaginatorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatAutocompleteModule, MatButtonModule, 
    MatCheckboxModule, MatChipsModule,
    MatDatepickerModule, MatDialogModule,
    MatFormFieldModule, MatIconModule , MatInputModule, 
    MatPaginatorModule, MatProgressSpinnerModule, 
    MatSelectModule, MatSnackBarModule, MatSortModule, 
    MatTableModule, MatTabsModule, MatToolbarModule,

    TranslateModule,
    FuseSharedModule
  ],
  providers: [
    CookieService,
  ],
  exports: [
    CommonModule,
    FormsModule,

    MatAutocompleteModule, MatButtonModule, 
    MatCheckboxModule, MatChipsModule,
    MatDatepickerModule, MatDialogModule,
    MatFormFieldModule, MatIconModule , MatInputModule, 
    MatPaginatorModule, MatProgressSpinnerModule, 
    MatSelectModule, MatSnackBarModule, MatSortModule, 
    MatTableModule, MatTabsModule, MatToolbarModule,

    TranslateModule,
    FuseSharedModule,

    GridColumnsPickerComponent, 
    HeaderComponent,
    AddOrderComponent,
    CustomePaginatorComponent,
    ProjectPipe,
    DocStatusPipe,
    ObjectsPipe,
    ErpsPipe,
    UnitsPipe,
    CurrencyPipe,
    SizePipe,
    FontAwesomeModule
  ],
  entryComponents: [
    DialogDeleteConfirmtionComponent,
    LinesDialogComponent
  ]
})
export class SharedModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, faCoffee, faFileExcel, faFilePdf,
      farSquare, farCheckSquare,
      faStackOverflow);
  }
}
