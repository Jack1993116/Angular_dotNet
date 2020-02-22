import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { GetUpdateCreate } from 'app/shared/interfaces';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

export class BaseEditCreate<T, S extends GetUpdateCreate<T>> {

    entity: T;
    public isSaving = false;
    form: FormGroup;

    constructor(public service: S, 
                public router: Router,
                public route: ActivatedRoute,
                public snacBar: MatSnackBar,
                public translateService: TranslateService,
                private title: string,
                private backUrl: string) {
    }

     getEntity(): void {
        this.route.data
            .subscribe((data: { entity: T }) => {
                this.entity = data.entity;
                console.log(this.entity);
            });
    }

    setForm(form: FormGroup): void {
        this.form = form;
    }

     goBack(): void {
        this.router.navigate([this.backUrl]);
    }

    save(entity: T, messege: string, entityKey: string,
         action: string, erpCompanyId?: number, logisticSiteCode?: string): void {
        
        this.isSaving = true;

        let actionObservablue: Observable<T>;
        if (action === 'edit') {
            actionObservablue = this.service.updateItem(entity, erpCompanyId, logisticSiteCode);
        }
        if (action === 'create') {
            actionObservablue = this.service.createItem(entity, erpCompanyId, logisticSiteCode);
        }
        
        this.handleEntityUpdateCallBack(actionObservablue, entityKey, messege);
            
    }

    public handleEntityUpdateCallBack(actionObservablue: Observable<T>, entityKey: string, 
                                      messege?: string): void {
        actionObservablue.subscribe(data => {
            if (data && data[entityKey]) {
                if (messege) {
                    this.snacBar.open(`${this.translateService.instant(messege, { value: data[entityKey] })}`, null, {
                        duration: 2000,
                        verticalPosition: 'top'
                    });
                }
                this.entity = data;
            }
            else {
                this.snacBar.open(`There was an issue, please check the log`, null, {
                    duration: 2000,
                    verticalPosition: 'top'
                });
            }
            this.isSaving = false;
        }, error => {
            this.snacBar.open(`There was an issue, please check the log`, null, {
                duration: 2000,
                verticalPosition: 'top'
            });
            this.isSaving = false;
        });
    }

    getTitle(): string {
        return this.title;
    }
}
