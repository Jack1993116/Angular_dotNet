import { Component, OnInit, Input } from '@angular/core';

import { ProjectsService } from 'app/feature/projects/projects.service';
import { Project } from 'app/feature/projects/Project';
import { FormGroup } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  // viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]

})
export class ProjectsComponent implements OnInit {
  
  @Input()
  form: FormGroup;
  projects: Project[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.form.controls['erpCompany'].valueChanges
    .pipe(
      startWith(this.form.controls['erpCompany'].value),
      debounceTime(50), 
      distinctUntilChanged(), 
      switchMap((term: number) => {
        if (term) {
           return this.projectsService.loadListResultsInternal(term);
        } else {
          return EMPTY;
        }
      }
    ))
    .subscribe(data => {
      this.projects = data;
    });
  }

}
