import { Injectable } from '@angular/core';

import { BaseLinesChecker } from './base-lines-checker';

@Injectable({
    providedIn: 'root'
})
export class LinesQtyChecker 
    implements BaseLinesChecker {

    isQtyValid(line: any, lineQty: number,
               allLines: any[]): boolean {
        let retValue = true;

        const linesToSum = allLines.filter(lines => lines.sol.lineSeq ===
            line.sol.lineSeq);
        const sum = linesToSum.reduce((s, l) => s + +l.baseQty, 0);
    
        if (sum > line.sol.qty) {
            retValue = false;
        }
        return retValue;
    }
}
