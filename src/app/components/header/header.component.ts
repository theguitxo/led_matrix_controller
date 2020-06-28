import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  /**
   * title to show in the toolbar
   */
  @Input('title') title: string;

  /**
   * route to redirect when push the back button
   * shows the back button if this property has a value
   */
  @Input('backHref') backHref: string = '';

  constructor() { }
}
