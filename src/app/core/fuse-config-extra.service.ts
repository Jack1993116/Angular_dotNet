import { Injectable } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';

@Injectable()
export class FuseConfigExtraService{
    constructor(private _fuseConfigService: FuseConfigService ){}

    hideAll(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    showAll(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: false
                },
                toolbar  : {
                    hidden: false
                },
                footer   : {
                    hidden: false
                },
                sidepanel: {
                    hidden: false
                }
            }
        };
    }
}
