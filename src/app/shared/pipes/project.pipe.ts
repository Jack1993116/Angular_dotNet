import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'app/constants';

@Pipe({
  name: 'project'
})
export class ProjectPipe implements PipeTransform {

  transform(projectCode: string, ...args: any[]): string {
    const projects = Constants.projects.slice(0);
    const item = projects
      .filter(prj => prj.projectCode === projectCode)[0];
    if (item) { return item.projectName; }
  }

}
