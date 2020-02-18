export class ExpectedGoodsShipment {
    docID: number;
    docNum: number;
    objType: string;
    seriesID: number;
    createDate: Date;
    updateDate: Date;
    reqDueDate: Date;
    confDueDate: Date;
    reqWeek: number;
    confWeek: number;
    bpCode: number;
    bpName: string;
    bpDocNum: string;
    erpDocNum: number;
    erpCompanyID: number;
    docStatusCode: string;
    attachID: number;
    expShipStID: number;
    logisticSiteCode: string;
    lines: ExpectedGoodsShipmentLines[];
}

export class ExpectedGoodsShipmentLines {
    lineID: number;
    objType: string;
    docID: number;
    lineSeq: number;
    baseObjType: string;
    baseDocID: number;
    baseDocNum: number;
    baseLineID: number;
    erpDocNum: number;
    bpDocNum: string;
    itemID: number;
    itemCode: string;
    shipItemUnitID: number;
    baseQty: number;
    allocated: number;
    onPlanning: number;
    onOrder: number;
    expRctQty: number;
    confDueDate: Date;
    lineStatusCode: string;
    logisticSiteCode: string;
    createDate: Date;
    updateDate: Date;
    attachID: number;
    revisionCode: string;
    allowPartialShip: boolean;
    allowPartialUOM: boolean;
    expShipStID: number;
    itemName: string;
    frgnName: string;
    shipLocID: number;
}

export class ExtendedExpectedGoodsShipmentL 
    extends ExpectedGoodsShipmentLines {
        docNum: number; 
        reqDueDate: Date | string;
        sol: SmallSOL;
}

export class SmallSOL {
        lineSeq: number;
        itemCode: string;
        qty: number;
        egslsQty: number;
}

export class CompatibleLine {
    objType: string;
    docNum: number;
    itemCode: string;
    itemName: string;
    itemFrgnName: string;
    itemID: number;
    openQuantity: number;
    lineId: number;
    docId: number;
}
