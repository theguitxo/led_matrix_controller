import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid-panel',
  templateUrl: './grid-panel.component.html',
  styleUrls: ['./grid-panel.component.scss'],
})
export class GridPanelComponent implements OnInit {

  @Input()leds: Array<Array<boolean>>;

  constructor() { }

  ngOnInit() {}

}
