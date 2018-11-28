


export class UtilService {

  public static getMoveDuration(currentFloor: number, nextFloor: number) {
    return Math.abs((currentFloor - nextFloor)) / 2 ;
  }
  public static createNumArray(num: number) {
    return Array(num).fill(num).map((x, i) => i);
  }
}
