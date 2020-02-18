import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ProjectsService } from '../projects.service';
import { Project } from '../Project';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectEditComponent 
  extends BaseEditCreate<Project, ProjectsService>
  implements OnInit {

  constructor(public projectsService: ProjectsService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
    super(projectsService,
          router, route, snacBar, translateService,
          'PROJECT_EDIT',
          '/projects');
  }

  ngOnInit(): void {
    this.getEntity();
  }

  save(event: Project): void {
    super.save(event,
      'PROJECT_EDITED', 'projectCode', 'edit',
      null, null);
  }

}
