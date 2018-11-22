


export class CalcUtilService {

  public static getMoveDuration(currentFloor: number, nextFloor: number) {
    return Math.abs((currentFloor - nextFloor)) / 2 ;
  }
}
