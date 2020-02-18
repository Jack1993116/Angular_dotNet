import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'app/constants';

@Pipe({
  name: 'docStatus'
})
export class DocStatusPipe implements PipeTransform {

  transform(docStatusCode: string, ...args: any[]): string {
    const docStatuses = Constants.docStatus.slice(0);
    const item = docStatuses
      .filter(docStat => docStat.docStatusCode === docStatusCode)[0];
    if (item) { return item.docStatusName; }
    else { return null; }
  }

}
