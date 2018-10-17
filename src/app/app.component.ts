import {Component} from '@angular/core';
import {UnsubscribeOnDestroy} from '@recrosoftware/ngx-utils';

import {Subscription} from 'rxjs';


@Component({
  selector: 'rs-root',
  template: `
    Project Showcase
  `
})
export class AppComponent {
  @UnsubscribeOnDestroy()
  private readonly subscription = Subscription.EMPTY;
}
