import { Injectable } from '@angular/core';

import { BaseLinesChecker } from './base-lines-checker';

@Injectable({
    providedIn: 'root'
})
export class SingleLineQtyChecker
    implements BaseLinesChecker {

    isQtyValid(line: any, lineQty: number, 
               allLines: any[]): boolean {
        let retValue = true;

        const sum = allLines.reduce((s, l) => s + +l.baseQty, 0);
        if (sum > lineQty) {
            retValue = false;
        }
        return retValue;
    }
}
