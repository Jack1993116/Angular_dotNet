import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'app/constants';

@Pipe({
  name: 'objects'
})
export class ObjectsPipe implements PipeTransform {

  transform(objectCode: string, ...args: any[]): string {
    const objects = Constants.objects.slice(0);
    const object = objects
      .filter(obj => obj.ObjTypeCode === objectCode)[0];
    if (object) { return object.ObjTypeName; }
  }

}
