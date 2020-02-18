export interface BaseLinesChecker {
    isQtyValid(line: any, lineQty: number,
               allLines: any[]): boolean;
}
