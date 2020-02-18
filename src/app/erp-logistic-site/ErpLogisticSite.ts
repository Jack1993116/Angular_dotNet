export class ERPCompany {
    erpCompanyID: number;
    erpCompanyName: string;
    vatNumber: string;
    localCurCode: string;
    sysCurCode: string;
}

export class LogisticSite {
    logisticSiteCode: string;
    logisticSiteName: string;
    daysForStockLogDelete: number;
    daysForTaskDelete: number;
    defaultLanguageID: number;
    picturesPath: string;
    logisticSiteDBName: string;
}

export class ERPCompanyApi {
    erpCompany: ERPCompany;
    checked: boolean;
}

export class LogisticSiteApi {
    logisticSite: LogisticSite;
    checked: boolean;
}
