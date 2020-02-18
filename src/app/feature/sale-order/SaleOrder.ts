import { LineUnitCode } from './tabs/line-unit-code/LineUnitCode';

export class SaleOrder {
    docID: number;
    docNum: number;
    bpCode: string;
    bpDocNum: string;
    bpName: string;
    docStatusCode: string;
    wfStatusID: number;
    erpDocID: number;
    erpDocNum: number;
    erpDocStatus: string;
    seriesID: number;
    createDate: Date;
    updateDate: Date;
    erpCompanyID: number;
    attachID: number;
    projectCode: string;
    localRate: number;
    sysRate: number;
    lines: SaleOrderLines[];
    attributes: { [key: number]: any };
}

export class SaleOrderLines {
    lineSeq: number;
    lineID: number;
    docID: number;
    itemID: number;
    itemCode: string;
    quantity: number;
    openQty: number;
    logisticSiteCode: string;
    lineStatusCode: string;
    releasedQty: number;
    attachID: number;
    revisionCode: string;
    createDate: Date;
    updateDate: Date;
    itemName: string;
    exportedToERPQty: number;
    erpLineID: number;
    baseLineID: number;
    objType: string;
    shipQty: number;
    itemFrgnName: string;
    allowPartialUOM: boolean;
    price: number;
    priceRatio: number;
    curCode: string;
    discount: number;
    lineTotal: number;
    finalLineTotal: number;
    localLineTotal: number;
    localFinalLineTotal: number;
    sysLineTotal: number;
    sysFinalLineTotal: number;
    localCostTotal: number;
    sysCostTotal: number;
    shipItemUnitID: number;
    shipUnitCode: string;
    unitCodes: LineUnitCode[];
    attributes: { [key: number]: any };
}
