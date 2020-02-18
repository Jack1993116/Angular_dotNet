import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfigExtraService } from '../fuse-config-extra.service';
import { AuthService } from '../auth.service';
import { UserProfile, AppUser } from 'app/model/user-profile';


import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as hebrew } from '../i18n/he';

@Component({
    selector     : 'app-login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    failedlogin = false;
    constructor(
        private formBuilder: FormBuilder,
        private fuseConfigEx: FuseConfigExtraService,
        private authService: AuthService,
        private router: Router,
        private transLoaderService: FuseTranslationLoaderService,
        private translateService: TranslateService){
        
        this.fuseConfigEx.hideAll();
        this.transLoaderService.loadTranslations(english, hebrew);
        this.translateService.use(this.translateService.currentLang);
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(2)]],
            password: ['', Validators.required]
        });
    }

    login(): void {
        const user = Object.assign(new AppUser(), {
            userCode: this.loginForm.get('userName').value,
            password: this.loginForm.get('password').value
        });

        this.authService.login(user).subscribe(data => {
            this.failedlogin = false;
            if (null === data) {
                this.failedlogin = true;
                this.loginForm.controls['password'].setErrors({incorrect: true});
                // this.loginForm.setErrors({incorrect: true});
                return;
            }

            if (this.authService.isLoggedIn) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                const redirect = this.authService.redirectUrl ?
                this.router.parseUrl(this.authService.redirectUrl) : '/home';
            
                // Set our navigation extras object
                // that passes on our global query params and fragment
                const navigationExtras: NavigationExtras = {
                    queryParamsHandling: 'preserve',
                    preserveFragment: true
                };
  
                // Redirect the user
                this.router.navigateByUrl(redirect, navigationExtras);
            }
        });
    }
}
