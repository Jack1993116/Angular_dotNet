import { Component, Input, OnInit,
  Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ProjectsService } from '../projects.service';
import { Project } from '../Project';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  @Input()
  project: Project;

  form: FormGroup;
  constructor(private _formBuilder: FormBuilder,
              private router: Router) { }

  @Output() saveEvent = new EventEmitter<Project>();
  @Output() formInit = new EventEmitter<FormGroup>();

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this._formBuilder.group({
      projectCode: [{
        value: this.project.projectCode, disabled: true
      }, Validators.required],
      projectName: [{
        value: this.project.projectName, disabled: false
      }, Validators.required],
      projectManager: [{
        value: this.project.mainPrjBpCode, disabled: false
      }, Validators.required],
    });

    setTimeout(() => this.formInit.next(this.form), 1);
  }

  goBack(event: any): void {
    this.router.navigate(['/projects']);
  }

  save(event: any): void {
    this.project.projectCode = this.form.get('projectCode').value;
    this.project.projectName = this.form.get('projectName').value;
    this.project.mainPrjBpCode = this.form.get('projectName').value;

    this.saveEvent.next(this.project);
  }
  
}
