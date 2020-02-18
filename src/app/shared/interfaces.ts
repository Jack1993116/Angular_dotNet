import { Observable } from 'rxjs';

export interface GetItem<T> {
    getItem(param: any[]): Observable<T>;
}

export interface GetUpdateCreate<T> {
    updateItem(entity: T, erpCompanyId?: number, 
               logisticSiteCode?: string): Observable<T>;
    createItem(entity: T, erpCompanyId?: number, 
               logisticSiteCode?: string): Observable<T>;
}

export interface ListItems<T> {
    loadListResults(page: number,
                    sort: string,
                    direction: string,
                    searchTerm: string): Observable<EntityApi<T>>;
}

export interface DeleteItem<T> {
    deleteItem(entity: T, erpCompanyId?: number, 
               logisticSiteCode?: string): Observable<any>;
}

export interface EntityApi<T> {
    items: T[];
    totalCount: number;
}

export class EntityApi<T>
    implements EntityApi<T> {

}
