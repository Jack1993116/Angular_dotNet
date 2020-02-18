import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'Administration',
        title    : 'Administration',
        translate: 'NAV.ADMINISTRATION',
        type: 'group',
        icon: 'dashboard',
        children : [
            {
                id       : 'General',
                title    : 'General',
                translate: 'NAV.GENRAL',
                type     : 'collapsable',
                icon: 'reorder',
                children: [
                    {
                        id: 'Logistic',
                        title: 'Logistic site parameter',
                        translate: 'NAV.LOGISTICSITEPARAM',
                        type: 'item',
                        icon: 'settings_ethernet',
                        url: '/sample',
                    },
                    {
                        id: 'Erp',
                        title: 'ERP Company',
                        translate: 'NAV.ERPCOMPANY',
                        type: 'item',
                        icon: 'business',
                        url: '/sample',
                    }
                ]
            }
        ]
    },
    {
        id: 'ItemsManagment',
        title: 'Items Managment',
        translate: 'NAV.ITEMMNG',
        type: 'group',
        icon: 'category',
        children: [
            {
                id: 'OITM',
                title: 'Item Master Data',
                translate: 'NAV.ITEMMASTERDATA',
                type: 'item',
                icon: 'select_all',
                url: '/feature/item-master-data',
            },
            {
                id: 'ItemPrice',
                title: 'Item Price List',
                translate: 'NAV.ITEMPRICELIST',
                type: 'item',
                icon: 'attach_money',
                url: '/sample',
            },
            {
                id: 'ItemesMng',
                title: 'Itemes Managment',
                translate: 'NAV.SETTINGS',
                type: 'collapsable',
                icon: 'category',
                children: [
                    {
                        id: 'ItemGrp',
                        title: 'Item Group',
                        translate: 'NAV.ITEMGRP',
                        type: 'item',
                        icon: 'group_work',
                        url: '/item-group',
                    },
                    {
                        id: 'UnitOfMsr',
                        title: 'Unit Of Measure',
                        translate: 'NAV.UNITOFMSR',
                        type: 'item',
                        icon: 'perm_data_setting',
                        url: '/units-measure',
                    },
                    {
                        id: 'ItemSize',
                        title: 'ItemSize',
                        translate: 'NAV.ITEMSIZE',
                        type: 'item',
                        icon: 'zoom_out_map',
                        url: '/item-size',
                    }
                ]
            },
        ]
    },
    {
        id: 'BuisnessPartners',
        title: 'Business Partners',
        translate: 'NAV.BUISNESSPARAMETERS',
        type: 'group',
        icon: 'contacts',
        children: [
        ]
    },
    // {
    //     id: 'GoodsRecipt',
    //     title: 'Goods Recipt',
    //     translate: 'NAV.GOODSRECIPT',
    //     type: 'group',
    //     icon: 'receipt',
    //     children: [
    //         {
    //             id: 'PrurchaseGoodsReceipt',
    //             title: 'Prurchase goods receipt',
    //             translate: 'NAV.PRCHGOOGDSRECIPT',
    //             type: 'item',
    //             icon: 'store',
    //             url: '/sample',
    //         },
    //         {
    //             id: 'ProductionGoodsReceipt',
    //             title: 'Production Goods Receipt',
    //             translate: 'NAV.PRDGOODSRECIPT',
    //             type: 'item',
    //             icon: 'class',
    //             url: '/sample',
    //         }
    //     ]
    // },
    {
        id: 'Sales',
        title: 'Sales',
        translate: 'NAV.SALES',
        type: 'group',
        icon: 'ballot',
        children: [
            {
                id: 'SaleOrder',
                title: 'Sale Order',
                translate: 'NAV.SALEORDER',
                type: 'item',
                icon: 'shopping_cart',
                url: '/feature/sale-order',
            },
            {
                id: 'ExpectedGoodsShipment',
                title: 'Expected Goods Shipment',
                translate: 'NAV.EXPGOODSSHIP',
                type: 'item',
                icon: 'departure_board',
                url: '/feature/expected-goods-shipment',
            }
        ]
    },
    {
        id: 'PROJECTS',
        title: 'PROJECTS',
        translate: 'NAV.PROJECTS',
        type: 'group',
        children: [
            {
                id: 'Projects',
                title: 'Projects',
                translate: 'NAV.PROJECTS',
                type: 'item',
                icon: 'ballot',
                url: 'feature/projects'
            }
        ]
    },
    {
        id: 'MRP',
        title: 'MRP',
        translate: 'NAV.MRP',
        type: 'group',
        children: [
            {
                id: 'SystemRequirementsManagement',
                title: 'System Requirements Management',
                translate: 'NAV.SYSREQMANG',
                type: 'item',
                icon: 'developer_board',
                url: 'feature/system-requirements-management'
            }
        ]
    },
    {
        id: 'INVENTORY',
        title: 'INVENTORY',
        translate: 'NAV.INVENTORY',
        type: 'group',
        children: [
            {
                id: 'locations',
                title: 'locations',
                translate: 'NAV.LOCATIONS',
                type: 'item',
                icon: 'location_on',
                url: 'feature/locations'
            }
        ]
    }
];
