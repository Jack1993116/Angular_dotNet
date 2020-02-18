import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { Project } from '../Project';
import { ProjectsService } from '../projects.service';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent 
  extends BaseList<Project, ProjectsService>
  implements OnInit, AfterViewInit { 

  pageCount: number[] = [];
  constructor(public router: Router,
              public projectsService: ProjectsService,
              public dialog: MatDialog,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
    super(router, projectsService, dialog, snacBar, translateService,
      'FUSE2.Project', ['projectCode', 'projectName',
      'mainPrjBpCode', 'delete'],
      'projects/create');
  }

  ngOnInit(): void {
    this.setColumns(['projectCode', 'delete']);
  }

  ngAfterViewInit(): void {
    this.getItems();
    setTimeout(() => {           
        for ( let i = 0; i < this.paginator.getNumberOfPages(); i++) {
            this.pageCount[i] = i + 1; 
        } 
    }, 2000);
  }

    updatePage(event: number) {
        this.getItems(event);
    }

    goFirstPage() {
        this.paginator.firstPage();
    }

    goPrevPage() {
        this.getItems(this.paginator.pageIndex - 1);      
    }

    goNextPage() {
        this.getItems(this.paginator.pageIndex + 1);             
    }

    goLastPage() {
        this.paginator.lastPage();
    }

  delete(item: Project): void {
    this.openDialog().subscribe(result => {
        if (result === true) {
            super.delete(item, 'PROJECT_DELETED', 'projectCode');
        }
    });  
  }

  openDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogDeleteConfirmtionComponent, {
        minWidth: '250px'
    });

    return dialogRef.afterClosed();
}

}
