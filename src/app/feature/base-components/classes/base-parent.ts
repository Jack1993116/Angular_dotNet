import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';

export abstract class BaseParent {

    public SubCompTitle: string;

    constructor(public unitOfMeasureService: UnitOfMeasureService) {
        this.unitOfMeasureService
        .getUnitOfMeasure().subscribe(data => {
          let eachLetter = '';
          data.forEach(ele => eachLetter += ele.unitCode[0]);
          console.log(eachLetter);
        });
    }

}
