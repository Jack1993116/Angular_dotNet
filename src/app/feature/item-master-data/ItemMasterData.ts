export class ItemMasterData {
    itemID: number;
    objType: string;
    itemCode: string;
    itemName: string;
    frgnName: string;
    itemNameTextID: number | null;
    itemGroupCode: number | null;
    itemType: string;
    sizeID: number | null;
    baseUnitCode: string;
    mainItemImage: string;
    attachID: number | null;
    wfTaskID: number | null;
    itemBPMng: string;
    inventoryItem: boolean;
    // eRPMappings: ItemERPMap[];
    itemLogisticSites: { [key: string]: ItemLogisticSite };
    attributes: { [key: number]: any };
    itemUnits: { [key: number]: string };
    revisionManaged: boolean;
    revTypeID: number;
}

export class ItemLogisticSite {
    itemLgID: number;
    logisticSiteCode: string;
    itemSetting: ItemSettings;
}

export class ItemSettings {
    defReceiveUnitCode: string;
    batchManaged: boolean;
    revisionManaged: boolean;
    minAvlBaseQty: number;
}
