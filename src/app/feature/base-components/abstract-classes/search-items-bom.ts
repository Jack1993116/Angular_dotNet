import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


import { ItemMasterData } from '../../item-master-data/ItemMasterData';
import { ItemMasterDataService } from '../../item-master-data/item-master-data.service';
import { SearchBase } from './search-base';

export abstract class SearchItemsBom extends SearchBase {

    public itemsSubject = new Subject<ItemMasterData[]>();
    public items$ = this.itemsSubject.asObservable();
    public searchTermItems = new Subject<[number, string]>();
    public erpCompanyId: number;
    public logisticSiteCode: string;
    
    
    constructor(public itemMasterDataService: ItemMasterDataService) {
        super();
     }

    public wireUpSearchItems(): void {
        this.searchTermItems
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: [number, string]) => {
                    return this.itemMasterDataService.searchItemsBOM(
                        term[0], this.erpCompanyId, 
                        this.logisticSiteCode, 
                        term[1]);
                }),
        ).subscribe(data => {
            if (data) {
                this.itemsSubject.next(data);
            }
        });
    }

}
