export class BusinessPartnerApi {
    items: BusinessPartner[];
    totalCount: number;
}

export class BusinessPartner {
    bpCode: string;
    bpName: string;
    mainErpBpCode: string;
}
