// export class BOMNode {
//     lineSeq: number;
//     childItemCode: string;
//     childUnitCode: string;
//     bomQty: number;
//     bomToTopQty: number;
//     quantity: number;
//     baseQty: number;
//     baseUnitCode: string;
//     include: boolean;
//   }

export class BOM  {
    lineBomID: number;
    objType: string;
    lineUnitID: number;
    parentItemID: number;
    parentItemCode: string;
    parentItemUnitID: number;
    parentUnitCode: string;
    childItemID: number;
    childItemUnitID: number;
    display: boolean;
    lineSeq: number;
    childItemCode: string;
    childUnitCode: string;
    bomQty: number;
    bomToTopQty: number;
    quantity: number;
    baseQty: number;
    baseUnitCode: string;
    include: boolean;
    childRevisionCode: string;
    useSalePrice: string;
    salePrice: number;
    discount: number;
    bomCTID: number | null;
    lineTotal: number;
    localLineTotal: number;
    sysLineTotal: number;
    costPrice: number;
    costCurrency: string;
    costTotal: number;
    localCostTotal: number;
    sysCostTotal: number;
    uiUpdate: boolean;
}

export class BOMNode
  extends BOM {
  children?: BOMNode[];
  delete: any;
}

export class BOM1Node {
  item: BOM;
  children?: BOM1Node[];
  first: boolean;
}

export class BOMFlatNode {
  item: BOM;
  level: number;
  expandable: boolean;
  first: boolean;
}
