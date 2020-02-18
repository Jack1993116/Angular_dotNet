import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


import { ItemMasterData } from '../../item-master-data/ItemMasterData';
import { ItemMasterDataService } from '../../item-master-data/item-master-data.service';
import { SearchBase } from './search-base';

export abstract class SearchItems extends SearchBase {

    public items$: Observable<ItemMasterData[]>;
    public searchTermItems = new Subject<string>();

    constructor(public itemMasterDataService: ItemMasterDataService) {
        super();
     }

    public wireUpSearchItems(): void {
        this.items$ = this.searchTermItems
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: string) =>
                    this.itemMasterDataService.searchItems(term)),
        );
    }
}
