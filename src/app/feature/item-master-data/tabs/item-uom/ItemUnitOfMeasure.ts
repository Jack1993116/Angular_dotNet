export class ItemUnitOfMeasureApi {
    items: ItemUnitOfMeasure[];
    totalCount: number;
}

export class ItemUnitOfMeasure {
    itemID: number;
    itemUnitID: number;
    itemCode: string; 
    unitCode: string; 
    childUnit: string;
    UnitToChildRatio: number;
    baseUnit: string;
    unitToBaseRatio: number;
    SerialManagement: number;
    weight: number;
    width: number;
    height: number;
    length: number;
    labelPerUOM: boolean;       
}
