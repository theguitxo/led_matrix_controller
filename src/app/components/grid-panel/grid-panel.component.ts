import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { LedPosition } from 'src/app/interfaces/led';

@Component({
  selector: "app-grid-panel",
  templateUrl: "./grid-panel.component.html",
  styleUrls: ["./grid-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPanelComponent {
  @Input() leds: Array<Array<number>>;
  @Input() name: string = "";
  @Input() custom: boolean = false;

  @Output() changeLed: EventEmitter<LedPosition> = new EventEmitter<LedPosition>();

  constructor() {}

  /**
   * ledOn
   *
   * checks if a led is on
   * @param {number} value state of the led: 0 -> off, 1 -> on
   * @returns a boolean
   */
  ledOn(value: number): boolean {
    return value > 0;
  }

  /**
   * ledOff
   *
   * checks if a led is off
   * @param {number} value state of the led: 0 -> off, 1 -> on
   * @returns a boolean
   */
  ledOff(value: number): boolean {
    return value < 1;
  }

  /**
   * change
   *
   * emits an event to inform that a led must change
   * @param {number} row number of the row in the matrix of the led who's changed
   * @param {number} col number of the column in the matrix of the led who's changed
   * @param {number} current the current value for the led: 0 -> off, 1 -> on
   */
  change(row: number, col: number, current: number): void {
    this.changeLed.emit({
      row,
      col,
      value: current ? 0 : 1,
    });
  }
}
