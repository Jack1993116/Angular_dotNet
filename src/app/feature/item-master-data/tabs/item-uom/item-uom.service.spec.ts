import { TestBed } from '@angular/core/testing';

import { ItemUomService } from './item-uom.service';

describe('ItemUomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemUomService = TestBed.get(ItemUomService);
    expect(service).toBeTruthy();
  });
});
