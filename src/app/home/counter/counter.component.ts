import { Component } from '@angular/core';
import { AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;

  constructor(private _authService: AuthService) {

  }

  public incrementCounter(): void {
    this.currentCount++;
  }

  canIncrement1(): boolean {
    if (!this._authService.authContext ||
      !this._authService.authContext.userProfile ||
      !this._authService.authContext.userProfile.userId) {
      return false;
    }

    const editPerm = this._authService.authContext.userProfile;
    // some logic...
    return true;
  }
}
