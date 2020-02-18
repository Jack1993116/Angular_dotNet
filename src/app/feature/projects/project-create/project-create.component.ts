import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ProjectsService } from '../projects.service';
import { Project } from '../Project';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectCreateComponent 
  extends BaseEditCreate<Project, ProjectsService>
  implements OnInit {

    constructor(public projectsService: ProjectsService,
                public router: Router,
                public route: ActivatedRoute,
                public snacBar: MatSnackBar,
                public translateService: TranslateService) { 
      super(projectsService,
        router, route, snacBar, translateService,
        'PROJECT_CREATE',
        '/projects');
}

  ngOnInit(): void {
    this.entity = new Project();
  }

  save(event: Project): void {
    const actionToTake = event.projectCode ? 'edit' : 'create';
    super.save(event, 
      'PROJECT_CREATED', 'projectCode', actionToTake,
      null, null);
  }

}
