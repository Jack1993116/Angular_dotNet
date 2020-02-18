import { Pipe, PipeTransform } from '@angular/core';

import { ItemSize } from 'app/feature/item-size/ItemSize';
import { ItemSizeService } from 'app/feature/item-size/item-size.service';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  static sizes: ItemSize[];
  constructor(private itemSizeService: ItemSizeService) {

  }

  transform(sizeId: number, ...args: any[]): any {
    if (!SizePipe.sizes) {
      this.itemSizeService
        .getItemSizes().subscribe(data => {
          SizePipe.sizes = data;
          return this.sizeIdToName(data, sizeId);
      });
    }
    return this.sizeIdToName(SizePipe.sizes, sizeId);
  }

  sizeIdToName(sizes: ItemSize[], sizeId): string{
    if (sizes) {
      const returnSize = sizes.filter(size => size.sizeID === sizeId )[0];
      if (returnSize) { return returnSize.sizeName; } 
    }   
  }
}
