import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';

import { AuthService } from 'app/core/auth.service';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ERPCompanyApi, LogisticSiteApi, ERPCompany, LogisticSite } from 'app/erp-logistic-site/ErpLogisticSite';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../i18n/en';
import { locale as hebrew } from '../../i18n/he';

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    USER_NAME = 'HELLO_GUEST';
    srcImage = 'assets/images/avatars/anonymous.png';
    erpCompany: ERPCompanyApi[];
    logisticSite: LogisticSiteApi[];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private transLoaderService: FuseTranslationLoaderService,
        private authService: AuthService,
        private ERPLogisticService: ERPLogisticSiteService,
        private router: Router
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            // {
            //    id   : 'tr',
            //    title: 'Turkish',
            //    flag : 'tr'
            // },
            {
                id: 'he',
                title: 'עברית',
                flag: 'il'
            }
        ];
        this.transLoaderService.loadTranslations(english, hebrew);

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        if (this.authService.isLoggedIn()){
            this.USER_NAME = this.authService.getUserName();
            this.srcImage = 'assets/images/avatars/Velazquez.jpg';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});

        if (this.isLoggedIn()){
            this.FillERPCompanyDropDown();
            this.FIllLogisticSiteDropDown();
        }
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    isLoggedIn(): boolean{
        return this.authService.isLoggedIn();
    }

    login(): void {
        this.router.navigate(['./login']);
    }

    logout(): void {
        this.authService.logout().subscribe(() => {     
            this.afterLogout();
        }, error => {
            this.afterLogout();
        });
        this.USER_NAME = 'HELLO_GUEST';
        this.srcImage = 'assets/images/avatars/anonymous.png';
    }

    afterLogout(): void {
        this.authService.clearUserAndStorage();
        this.router.navigate(['./home']);
    }

    FillERPCompanyDropDown(): void {
        this.ERPLogisticService.getERP()
            .subscribe(data => this.erpCompany = data);
    }

    FIllLogisticSiteDropDown(): void {
        this.ERPLogisticService.getLogisticSite()
            .subscribe(data => this.logisticSite = data);
    }

    onChangeErp(erp: ERPCompany): void {
        this.ERPLogisticService.alterCheckERP(erp);
    }

    onChangeLogisticSite(site: LogisticSite): void {
        this.ERPLogisticService.alterCheckLogisticSite(site);
    }
}
