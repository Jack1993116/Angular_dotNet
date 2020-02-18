export class Constants {


    public static apiRoot = 'https://securingangularappscourse-api.azurewebsites.net/api/';
    public static stsAuthority = 'https://securingangularappscourse-sts.azurewebsites.net/';

    // public static apiRoot = 'http://localhost:52571';
    // public static stsAuthority = 'http://localhost:52571';

    public static clientId = 'spa-client';
    // TODO: this should come as a parameter
    // public static clientRoot = 'http://13.80.120.155:52094/';
    // public static clientRoot = 'http://localhost:52094/';
    public static clientRoot;
    public static groupCode = [
        { itemGroupCode: 100, groupName: 'Group A' },
        { itemGroupCode: 200, groupName: 'Group B' },
        { itemGroupCode: 300, groupName: 'Group C' }
    ];

    public static itemType = [
        { type: 'M', desc: 'Material' },
        { type: 'S', desc: 'Service' },
        { type: 'L', desc: 'Labore' }
    ];

    public static invManageType = [
        { invType: 'S', invDesc: 'Serial' },
        { invType: 'B', invDesc: 'Batch'}
    ];

    public static projects = [
        { projectCode: 'PRJ', projectName: 'Project', pmID: 1},
        { projectCode: 'PRJ1', projectName: 'Project01', pmID: 2},
        { projectCode: 'PRJ2', projectName: 'Project02', pmID: 3}
    ];

    public static docStatus = [
        { docStatusCode: 'C', docStatusName: 'Closed' },
        { docStatusCode: 'I', docStatusName: 'In Progress' },
        { docStatusCode: 'P', docStatusName: 'Planned' },
        { docStatusCode: 'R', docStatusName: 'Released' }
    ];

    public static objects = [
        { ObjTypeCode: 'BP', ObjTypeName: 'Business Partners'},
        { ObjTypeCode: 'Itm', ObjTypeName: 'Item Master Data'},
        { ObjTypeCode: 'ItmRev', ObjTypeName: 'Item Revision'},
        { ObjTypeCode: 'SalOrd', ObjTypeName: 'Sales Order'},
        { ObjTypeCode: 'WorkOrd', ObjTypeName: 'Work Order'}
    ];
}
