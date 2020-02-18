export interface Location {
        locID: number;
        locCode: string;
        displayLocCode: string;
        locName: string;
        buildID: number;
        locStatus: string;
        receiptLocation: boolean;
        shippingLocation: boolean;
        pickingLocation: boolean;
        stockLocation: boolean;
        areaCode: string;
        area: number | null;
        aisleCode: string;
        aisle: number | null;
        columnCode: string;
        column: number | null;
        levelCode: string;
        level: number | null;
        width: number;
        height: number;
        length: number;
        restrictBySize: boolean;
        printerID: number;
        logisticSiteCode: string;
}

export interface LogisticLocation {
        [key: string]: number[];
}


