import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { GetItem } from '../interfaces';

@Injectable()
export class GenericResolverService<T, U extends GetItem<T>> 
  implements Resolve<T> {
 
  constructor(private dataService: U,
              private router: Router,
              private paramList: string[]) {

  }

  resolve(route: ActivatedRouteSnapshot, 
          stata: RouterStateSnapshot):
      Observable<T> | Observable<never> {
      const params = Array<any>();
      this.paramList.forEach(element => {
        params.push(route.paramMap.get(element));
      });

      return this.dataService.getItem(params).pipe(
        take(1),
        mergeMap(item => {
            if (item) {
                return of(item);
            } else {
                this.router.navigate(['/error/not-found']);
                return EMPTY;
            }
        })
      );
  }
}
