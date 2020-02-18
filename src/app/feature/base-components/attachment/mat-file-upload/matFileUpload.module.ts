import { NgModule } from '@angular/core';
import { MatFileUploadComponent } from './matFileUpload/matFileUpload.component';
import { MatFileUploadQueueComponent } from './matFileUploadQueue/matFileUploadQueue.component';
import { FileUploadInputForDirective } from './fileUploadInputFor.directive';

import { TranslateModule } from '@ngx-translate/core';

import { MatProgressBarModule, MatCardModule, MatButtonModule, MatFormFieldModule , MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BytesPipe } from './bytes.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
      MatButtonModule,
      MatProgressBarModule,
      MatIconModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      TranslateModule
  ],
  declarations: [
    MatFileUploadComponent,
    MatFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe
  ],
  exports: [
    MatFileUploadComponent,
    MatFileUploadQueueComponent,
    FileUploadInputForDirective,
    BytesPipe
  ]
})
export class MatFileUploadModule { }
