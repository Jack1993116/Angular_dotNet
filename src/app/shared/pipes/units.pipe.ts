import { Pipe, PipeTransform } from '@angular/core';

import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';
import { UnitOfMeasure } from 'app/core/services/unit-of-measure/UnitOfMeasure';

@Pipe({
  name: 'units'
})
export class UnitsPipe implements PipeTransform {

  static units: UnitOfMeasure[];
  constructor(private unitOfMeasureService: UnitOfMeasureService) {

  }
  transform(unitCode: any, ...args: any[]): string {
    if (!UnitsPipe.units) {
      this.unitOfMeasureService
        .getUnitOfMeasure().subscribe(data => {
          UnitsPipe.units = data;
          return this.unitsToUnitName(data, unitCode);
      });
    }
    return this.unitsToUnitName(UnitsPipe.units, unitCode);
  }

  unitsToUnitName(units: UnitOfMeasure[], unitCode): string{
    if (units) {
      const returnUnit = units.filter(unit => unit.unitCode === unitCode )[0];
      if (returnUnit) { return returnUnit.unitName; } 
    }   
  }
}
