export class UtilsPanel {
  /**
   * getDataPanel
   * 
   * transforms a two dimensional array into a string formed with all values
   * @param {Array<Array<number>>} data two dimensional array with the states of the leds matrix
   * @returns a string formed with all the values of the received array
   */
  static getDataPanel(data: Array<Array<number>>): string {
    let pictureData: string = "";

    data.forEach((item) => {
      pictureData += (
        "00000000" +
        item
          .reduce((acumulator: number, current: number) => {
            return parseInt(acumulator.toString() + current.toString());
          })
          .toString()
      ).slice(-8);
    });

    return pictureData;
  }
}
