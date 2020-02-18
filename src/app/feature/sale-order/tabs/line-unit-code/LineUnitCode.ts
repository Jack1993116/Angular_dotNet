import { BOM } from '../bom/BOM';

export class LineUnitCode {
    lineUnitID: number;
    objType: string;
    lineID: number;
    lineSeq: number;
    quantity: number;
    releasedQty: number;
    itemUnitID: number;
    unitCode: string;
    baseQty: number;
    releasedBaseQty: number;
    baseItemUnitID: number;
    baseUnitCode: string;
    revisionCode: string;
    docID: number;
    boms: BOM[];
}
